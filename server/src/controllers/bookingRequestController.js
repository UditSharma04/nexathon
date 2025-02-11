import BookingRequest from '../models/BookingRequest.js';
import Item from '../models/Item.js';

export const createBookingRequest = async (req, res) => {
  try {
    const { itemId, startDate, endDate, message, period } = req.body;
    const requesterId = req.user.id;

    console.log('Creating booking request:', {
      itemId,
      startDate,
      endDate,
      message,
      period,
      requesterId
    });

    // Find the item and verify it exists
    const item = await Item.findById(itemId);
    if (!item) {
      console.log('Item not found:', itemId);
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('Found item:', item);

    // Verify item is available
    if (item.status !== 'available') {
      console.log('Item not available:', item.status);
      return res.status(400).json({ message: 'Item is not available for booking' });
    }

    // Calculate total amount based on item price and duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalAmount;

    if (period === 'hour') {
      // Calculate hours difference
      const diffInMilliseconds = end - start;
      const hours = Math.ceil(diffInMilliseconds / (1000 * 60 * 60));
      totalAmount = item.price * hours;
      
      console.log('Calculated amount (hourly):', { hours, totalAmount });
    } else {
      // Calculate days difference
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      totalAmount = item.price * days;
      
      console.log('Calculated amount (daily):', { days, totalAmount });
    }

    // Create booking request
    const bookingRequest = new BookingRequest({
      item: itemId,
      owner: item.owner,
      requester: requesterId,
      startDate,
      endDate,
      message,
      totalAmount,
      period // Add period to the booking request
    });

    console.log('Created booking request:', bookingRequest);

    await bookingRequest.save();
    console.log('Saved booking request');

    // Populate the response with item and user details
    const populatedRequest = await BookingRequest.findById(bookingRequest._id)
      .populate('item', 'name images price insurance')
      .populate('owner', 'name email')
      .populate('requester', 'name email');

    console.log('Populated request:', populatedRequest);

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Create booking request error:', error);
    res.status(500).json({ 
      message: 'Error creating booking request', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await BookingRequest.find({ requester: req.user.id })
      .populate('item', 'name images price insurance')
      .populate('owner', 'name email')
      .sort('-createdAt');

    res.json(requests);
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Error fetching booking requests' });
  }
};

export const getIncomingRequests = async (req, res) => {
  try {
    const requests = await BookingRequest.find({ owner: req.user.id })
      .populate('item', 'name images price insurance')
      .populate('requester', 'name email')
      .sort('-createdAt');

    res.json(requests);
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ message: 'Error fetching incoming requests' });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, isRequester, returnConfirmation } = req.body;
    
    const request = await BookingRequest.findById(requestId)
      .populate('item');
    
    if (!request) {
      return res.status(404).json({ message: 'Booking request not found' });
    }

    // If marking as returned, handle return confirmation
    if (status === 'returned' && returnConfirmation) {
      // Initialize returnConfirmation if it doesn't exist
      if (!request.returnConfirmation) {
        request.returnConfirmation = {
          owner: false,
          requester: false
        };
      }

      // Update the appropriate confirmation
      if (isRequester) {
        request.returnConfirmation.requester = true;
      } else {
        request.returnConfirmation.owner = true;
      }

      // If both have confirmed, complete the return
      if (request.returnConfirmation.owner && request.returnConfirmation.requester) {
        request.status = 'completed';
        // Update item status to available
        await Item.findByIdAndUpdate(request.item._id, {
          status: 'available'
        });
      }
    } else {
      request.status = status;
    }

    await request.save();

    // Return populated response
    const updatedRequest = await BookingRequest.findById(requestId)
      .populate('item', 'name images price status')
      .populate('owner', 'name email')
      .populate('requester', 'name email');

    res.json(updatedRequest);
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ 
      message: 'Error updating request status',
      error: error.message
    });
  }
};

export const updateBookingPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentDetails, paymentStatus } = req.body;

    // Find the booking
    const booking = await BookingRequest.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    booking.status = status;
    booking.paymentStatus = paymentStatus;
    booking.paymentDetails = paymentDetails;
    await booking.save();

    // Update item status
    if (status === 'borrowed') {
      await Item.findByIdAndUpdate(booking.item, {
        status: 'borrowed',
        updatedAt: new Date()
      });
    }

    // Populate necessary fields before sending response
    const updatedBooking = await BookingRequest.findById(id)
      .populate('item', 'name images price insurance status')
      .populate('owner', 'name email')
      .populate('requester', 'name email');

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking payment status:', error);
    res.status(500).json({ 
      message: 'Error updating booking status',
      error: error.message
    });
  }
}; 
import User from '../models/User.js';
import Item from '../models/Item.js';
import BookingRequest from '../models/BookingRequest.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching profile for user:', userId);

        // Get user data
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Found user:', user.name);

        // Get user's items with their booking counts
        const items = await Item.find({ owner: userId })
            .select('name status images totalBookings')
            .sort('-createdAt')
            .limit(5);
        console.log('User items:', items.map(i => ({ id: i._id, name: i.name })));

        // Get total items count
        const totalItems = await Item.countDocuments({ owner: userId });
        console.log('Total items owned by user:', totalItems);

        // Debug: Get all booking requests for this user
        const allBookings = await BookingRequest.find({
            $or: [{ owner: userId }, { requester: userId }]
        });
        console.log('All bookings involving user:', allBookings.map(b => ({
            id: b._id,
            owner: b.owner,
            requester: b.requester,
            status: b.status
        })));

        // Get bookings where user is the owner (items they've lent out)
        const ownerBookings = await BookingRequest.countDocuments({
            owner: userId,
            status: 'accepted'
        });
        console.log('Owner bookings count:', ownerBookings);

        // Debug: List all owner bookings
        const ownerBookingsList = await BookingRequest.find({
            owner: userId,
            status: 'accepted'
        });
        console.log('Owner bookings details:', ownerBookingsList.map(b => ({
            id: b._id,
            requester: b.requester,
            status: b.status,
            amount: b.totalAmount
        })));

        // Get bookings where user is the requester (items they've borrowed)
        const requesterBookings = await BookingRequest.countDocuments({
            requester: userId,
            status: 'accepted'
        });
        console.log('Requester bookings count:', requesterBookings);

        // Debug: List all requester bookings
        const requesterBookingsList = await BookingRequest.find({
            requester: userId,
            status: 'accepted'
        });
        console.log('Requester bookings details:', requesterBookingsList.map(b => ({
            id: b._id,
            owner: b.owner,
            status: b.status,
            amount: b.totalAmount
        })));

        // Calculate total earnings from accepted bookings where user is the owner
        const completedBookings = await BookingRequest.find({
            owner: userId,
            status: 'accepted'
        });
        const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
        console.log('Total earnings:', totalEarnings, 'from', completedBookings.length, 'completed bookings');

        // Update totalBookings for each item
        for (const item of items) {
            const itemBookings = await BookingRequest.countDocuments({
                item: item._id,
                status: 'accepted'
            });
            console.log('Item bookings:', { 
                itemId: item._id, 
                name: item.name, 
                currentCount: item.totalBookings, 
                actualCount: itemBookings 
            });
            
            // Only update if the count is different
            if (item.totalBookings !== itemBookings) {
                await Item.findByIdAndUpdate(item._id, { totalBookings: itemBookings });
                item.totalBookings = itemBookings;
                console.log('Updated item booking count:', { 
                    itemId: item._id, 
                    newCount: itemBookings 
                });
            }
        }

        const totalBookings = ownerBookings; // Only count bookings where user is the owner
        console.log('Final totals:', {
            ownerBookings,
            requesterBookings,
            totalBookings,
            totalEarnings
        });

        // Format the response
        const profileData = {
            name: user.name,
            email: user.email,
            memberSince: user.created_at,
            rating: user.reputation_score || 0,
            totalItems,
            totalBookings, // Only owner bookings
            totalEarnings,
            items: items.map(item => ({
                id: item._id,
                name: item.name,
                status: item.status,
                totalBookings: item.totalBookings || 0,
                image: item.images?.[0] || null
            }))
        };

        console.log('Sending profile data:', profileData);
        res.json(profileData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

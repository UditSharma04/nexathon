import User from '../models/User.js';
import Item from '../models/Item.js';
import Booking from '../models/Booking.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user data
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's items
        const items = await Item.find({ owner: userId })
            .select('name status images totalBookings')
            .sort('-createdAt')
            .limit(5);

        // Get total items count
        const totalItems = await Item.countDocuments({ owner: userId });

        // Get total bookings (both as lender and borrower)
        const totalBookings = await Booking.countDocuments({
            $or: [
                { lender: userId },
                { borrower: userId }
            ]
        });

        // Calculate total earnings from completed bookings
        const bookings = await Booking.find({
            lender: userId,
            status: 'completed'
        });
        const totalEarnings = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

        // Format the response
        const profileData = {
            name: user.name,
            email: user.email,
            memberSince: user.created_at,
            rating: user.reputation_score || 0,
            totalItems,
            totalBookings,
            totalEarnings,
            items: items.map(item => ({
                id: item._id,
                name: item.name,
                status: item.status,
                totalBookings: item.totalBookings || 0,
                image: item.images?.[0] || null
            }))
        };

        res.json(profileData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

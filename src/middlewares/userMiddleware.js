import Client from '../models/clientModel.js'

export const userMiddleware = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "id is required" });
    }
    try {
        const user =
            await Client.findById(id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user; 
        next();
    } catch (error) {
        console.error("Error in UserMiddleware:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

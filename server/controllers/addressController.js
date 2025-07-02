import Address from '../models/Address.js';

// ✅ Add Address
const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;

    if (!address || !userId) {
      return res.status(400).json({ success: false, message: "Missing address or userId" });
    }

    await Address.create({ ...address, userId });

    res.json({ success: true, message: 'Address added successfully' });
  } catch (error) {
    console.log("Add Address Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Address
const getAddress = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const address = await Address.find({ userId });

    res.json({ success: true, address });
  } catch (error) {
    console.log("Get Address Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Named Exports
export { addAddress, getAddress };

import * as supportService from '../service/supportService.js';

const updateStatus = async (req, res) => {
    const supportId = req.params.supportId;
    const { newStatus } = req.body;

    try {
        const result = await supportService.updateSupportStatus(supportId, newStatus);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy yêu cầu hỗ trợ' });
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
const createSupport = async (req, res) => {
    const { mssv, support_type, title, description, contact_info } = req.body;

    if (!mssv || !support_type || !title || !description) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc." });
    }

    try {
        const result = await supportService.createSupport({
            mssv,
            support_type,
            title,
            description,
            contact_info
        });

        res.status(201).json({ message: "Gửi yêu cầu hỗ trợ thành công!", supportId: result.insertId });
    } catch (error) {
        console.error("Lỗi khi tạo yêu cầu hỗ trợ:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export default {
    updateStatus,
    createSupport
};





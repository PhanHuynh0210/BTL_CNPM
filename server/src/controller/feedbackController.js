import feedbackService from "../service/feedbackService.js";

const createFeedback = async (req, res) => {
    try {
        const result = await feedbackService.createFeedback(req.body);
        res.status(201).json({
            message: "Gửi phản hồi thành công!",
            feedbackId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi gửi phản hồi",
            error: error.message
        });
    }
};
const getFeedbacks = async (req, res) => {
    try {
        const result = await feedbackService.getFeedbackList();
        res.json({ data: result });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách đánh giá",
            error: error.message
        });
    }
};
export default {
    createFeedback,
    getFeedbacks
  };

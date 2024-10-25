import Faq from "../Models/faq.model.js"


export const getAllFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.status(200).json(faqs);
    } catch (error) {
        console.error("Error in getAllFaqs:", error);
        res.status(500).json({ message: "Error fetching faqs" });
    }
}


export const getSingleFaq = async (req, res) => {
    try {
        const faqId = req.params.id;
        const faq = await Faq.findById(faqId);

        if (!faq) {
            return res.status(404).json({ message: "Faq not found" });
        }

        res.status(200).json(faq);
    } catch (error) {
        console.error("Error in getSingleFaq:", error);
        res.status(500).json({ message: "Error fetching faq" });
    }
}


export const createFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question ||!answer) {
            return res.status(400).json({ message: "All fields (question, answer) are required" });
        }

        const newFaq = new Faq({ question, answer });
        await newFaq.save();

        res.status(201).json({ message: "Faq created successfully", faq: newFaq });
    } catch (error) {
        console.error("Error in createFaq:", error);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ message: messages.join(". ") });
        }
        res.status(500).json({ message: "Server error" });
    }
}


export const editFaq = async (req, res) => {
    try {
        const faqId = req.params.id;
        const { question, answer } = req.body;

        if (!faqId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid FAQ ID format" });
        }

        const updateData = {};
        if (question!== undefined) updateData.question = question;
        if (answer!== undefined) updateData.answer = answer;

        const updatedFaq = await Faq.findByIdAndUpdate(faqId, updateData, { new: true, runValidators: true });

        if (!updatedFaq) {
            return res.status(404).json({ message: "Faq not found" });
        }

        res.status(200).json({ message: "Faq updated successfully", faq: updatedFaq });
    } catch (error) {
    
}
}


export const deleteFaq = async (req, res) => {
    try {
        const faqId = req.params.id;

        if (!faqId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid FAQ ID format" });
        }

        const faq = await Faq.findByIdAndDelete(faqId);

        if (!faq) {
            return res.status(404).json({ message: "Faq not found" });
        }

        res.status(200).json({ message: "Faq deleted successfully" });
    } catch (error) {
        console.error("Error in deleteFaq:", error);
        res.status(500).json({ message: "Error deleting FAQ" });
    }
}




import subhabitServices from "../services/Subhabit.service.js";

class Subhabit {
    create = async (req, res) => {
        const { name, description, habitId, points } = req.body;   
        const subhabit = await subhabitServices.create({ name, description, habitId, points });
        if (!subhabit.status) {
            return res.status(400).json(subhabit);
        }
        return res.status(201).json(subhabit);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const subhabit = await subhabitServices.update(id, req.body);
        if (!subhabit.status) {
            return res.status(400).json(subhabit);
        }
        return res.status(200).json(subhabit);
    }

    delete = async(req, res) => {
        const { id } = req.params;
        const subhabit = await subhabitServices.delete(id);
        if (!subhabit.status) {
            return res.status(400).json(subhabit);
        }
        return res.status(200).json(subhabit);
    }

    get = async (req, res) => {
        const { id } = req.params;
        const subhabit = await subhabitServices.get(id);
        if (!subhabit.status) {
            return res.status(400).json(subhabit);
        }
        return res.status(200).json(subhabit);
    }
    getByHabit = async (req, res) => {
        const { id } = req.params;
        const subhabits = await subhabitServices.getByHabit(id);
        if (!subhabits.status) {
            return res.status(400).json(subhabits);
        }
        return res.status(200).json(subhabits);
    }
}
const subhabitController = new Subhabit();
export default subhabitController;
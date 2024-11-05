import express from 'express';
import { createActor, getAllActors, getActorById, updateActor, deleteActor } from '../Controller/actor.controller.js';

const router = express.Router();

router.post('/', createActor); // Aktör oluştur
router.get('/', getAllActors); // Tüm aktörleri listele
router.get('/:id', getActorById); // Belirli bir aktörü al
router.put('/:id', updateActor); // Aktörü güncelle
router.delete('/:id', deleteActor); // Aktörü sil

export default router;

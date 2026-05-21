module.exports = mongoose => {
    const Schema = mongoose.Schema;

    const CommandeSchema = new Schema({
        client: { type: String, required: true },
        plats: [
            {
                plat: { type: Schema.Types.ObjectId, ref: 'Plat', required: true },
                quantite: { type: Number, default: 1 }
            }
        ],
        total: { type: Number, default: 0 },
        statut: {
            type: String,
            enum: ['en attente', 'confirmée', 'livrée', 'annulée'],
            default: 'en attente'
        }
    }, { timestamps: true });

    CommandeSchema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Commande = mongoose.model('Commande', CommandeSchema);
    return Commande;
};
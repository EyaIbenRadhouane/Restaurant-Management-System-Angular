module.exports = mongoose => {
    const Schema = mongoose.Schema;

    const CategorieSchema = new Schema({
        nom: { type: String, required: true },
        description: { type: String }
    }, { timestamps: true });

    CategorieSchema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Categorie = mongoose.model('Categorie', CategorieSchema);
    return Categorie;
};
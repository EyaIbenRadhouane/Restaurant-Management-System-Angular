module.exports = mongoose => {
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'client'], default: 'client' }
  }, { timestamps: true });

  UserSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model('User', UserSchema);
};
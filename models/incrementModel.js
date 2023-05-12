const mongoose = require('mongoose')
const counterSchema = mongoose.Schema(
    {
        _id: { type: String, required: true },
        seq: { type: Number, default: 0 }
    }
);

counterSchema.index({ _id: 1, seq: 1 }, { unique: true })

const counterModel = mongoose.model('counter', counterSchema);

const autoIncrementModelID = function (modelName, doc, next) {
    return counterModel
        .findOneAndUpdate(
            { _id: modelName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        )
        .then((counter) => {
            if (!counter) {
                throw new Error('Counter not found');
            }
            doc.id = counter.seq;
            next();
        })
        .catch((error) => {
            next(error);
        });
};

module.exports = autoIncrementModelID;
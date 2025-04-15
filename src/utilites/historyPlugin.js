import History from "../models/historyModel.js";

export function historyPlugin(schema, options) {
  const { moduleName } = options;

  const saveHistory = async function (filter) {
    const docToDelete = await this.model.findOne(filter);
    if (docToDelete) {
      await History.create({
        module: moduleName,
        itemId: docToDelete._id,
        data: docToDelete.toObject(),
        description: "Deleted via middleware"
      });
    }
  };

  // Hook for findOneAndDelete
  schema.pre("findOneAndDelete", async function (next) {
    await saveHistory.call(this, this.getFilter());
    next();
  });

  // Hook for findByIdAndDelete
  schema.pre("findByIdAndDelete", async function (next) {
    await saveHistory.call(this, this.getFilter());
    next();
  });
}

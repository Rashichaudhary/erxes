import mongoose from 'mongoose';
import { field } from './utils';
import { COC_CONTENT_TYPES } from '../../data/constants';
/*
 * internal note schema
 */
const InternalNoteSchema = mongoose.Schema({
  _id: field({ pkey: true }),
  contentType: field({
    type: String,
    enum: COC_CONTENT_TYPES.ALL,
  }),
  contentTypeId: field({ type: String }),
  content: field({
    type: String,
  }),
  createdUserId: field({
    type: String,
  }),
  createdDate: field({
    type: Date,
  }),
});

class InternalNote {
  /* Create new internalNote
   *
   * @param {String} contentType form, customer, company
   * @param {String} contentTypeId when contentType is form, it will be
   * formId
   *
   * @return {Promise} newly created internalNote object
   */
  static async createInternalNote({ contentType, contentTypeId, ...fields }, user) {
    return this.create({
      contentType,
      contentTypeId,
      createdUserId: user._id,
      createdDate: new Date(),
      ...fields,
    });
  }

  /*
   * Update internalNote
   * @param {String} _id internalNote id to update
   * @param {Object} doc internalNote values to update
   * @return {Promise} updated internalNote object
   */
  static async updateInternalNote(_id, doc) {
    await this.update({ _id }, { $set: doc });

    return this.findOne({ _id });
  }

  /*
   * Remove internalNote
   * @param {String} _id internalNote id to remove
   * @return {Promise}
   */
  static async removeInternalNote(_id) {
    const internalNoteObj = await this.findOne({ _id });

    if (!internalNoteObj) throw new Error(`InternalNote not found with id ${_id}`);

    return internalNoteObj.remove();
  }
}

InternalNoteSchema.loadClass(InternalNote);

const InternalNotes = mongoose.model('internal_notes', InternalNoteSchema);

export default InternalNotes;

const mongoose = require('mongoose');

const storiesSchema = mongoose.Schema({
    title: {type: String, required: true},
    url: {type: String, required: true},
    votes: {type: Number, required: true}
})

storiesSchema.methods.apiRepr = function() {
  return {
    title: this.title,
    url: this.url,
    votes: this.votes,
    id: this._id
  }
}

const Story = mongoose.model('Story', storiesSchema);

module.exports = {Story};

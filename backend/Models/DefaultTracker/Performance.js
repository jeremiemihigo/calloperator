const mongoose = require("mongoose");

const performance = new mongoose.Schema({
  codeAgent: { type: String, required: true },
  sat: { type: String, required: true },
  mtd_last_month: { type: String, required: true },
  mtd_this_month: { type: String, required: true },
  gap_visit_percent: { type: String, required: true },
  object_visited: { type: String, required: true },
  object_visited_by_other: { type: String, required: true },
  no_visited_object: { type: String, required: true },
  tot_track: { type: String, required: true },
  vm_target_in_mtd: { type: String, required: true },
  percent_visit_vs_target: { type: String, required: true },
  current_visit_target: { type: String, required: true },
  notes_on_visits: { type: String, required: true },
  percent_realisation_cash: { type: String, required: true },
  categorisable: { type: String, required: true },
  categorie: { type: String, required: true },
  a_tracker_pour_completer: { type: String, required: true },
  rien_payer: { type: String, required: true },
  eteint_aujourdhui: { type: String, required: true },
  no_action_potentiel_default: { type: String, required: true },
  action_potentiel_default: { type: String, required: true },
  object_potentiel_default: { type: String, required: true },
  payed_after_visit: { type: String, required: true },
  payed_before_visit: { type: String, required: true },
  percent_realisation_potentiel_default: { type: String, required: true },
});
const feedback = new mongoose.Schema(
  {
    message: { type: String, required: true },
    sender: { type: String, required: true },
    last_message: { type: String, required: false },
    id: { type: String, required: true },
    filename: { type: String, required: false },
    agents: { type: [String], required: false },
    column: { type: [String], required: false },
  },
  { timestamps: true }
);
const schema = new mongoose.Schema(
  {
    data: { type: [performance], required: false },
    savedby: { type: String, required: true },
    editedby: { type: String, required: false },
    id: { type: String, required: true },
    conversation: { type: [feedback], required: false },
    title: { type: String, required: true, trim: true },
    actif: { type: Boolean, required: true, default: true },
    source_feedback: {
      type: [String],
      required: true,
      enum: ["agent", "staff"],
      default: ["agent", "staff"],
    },
  },
  { timestamps: true }
);
const model = mongoose.model("performance", schema);
module.exports = model;

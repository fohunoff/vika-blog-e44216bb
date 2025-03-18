
import { dbAsync } from '../../../db/config.js';

// DELETE a diary entry
export const deleteDiaryEntry = async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting diary entry with ID: ${id}`);

  try {
    const result = await dbAsync.run("DELETE FROM diary_entries WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: `Diary entry with id ${id} not found` });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting entry:", err);
    return res.status(500).json({ error: "Failed to delete entry" });
  }
};

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/attendance';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const oldSchema = new mongoose.Schema({}, { strict: false });
const OldModel = mongoose.model('teachertimetable', oldSchema);

const newSchema = new mongoose.Schema({
  teacherId: String,
  teacherName: String,
  timetable: Array
});

const NewModel = mongoose.model('cleanedteachertimetable', newSchema);

async function migrateData() {
  try {
    const oldDoc = await OldModel.findOne();

    if (!oldDoc) {
      console.log('No data found in old collection');
      return;
    }

    let insertedCount = 0;

    for (let key in oldDoc.toObject()) {
      if (key === '_id') continue;

      const teacherData = oldDoc[key];
      const newDoc = new NewModel({
        teacherId: key,
        teacherName: teacherData.teacherName || '',
        timetable: teacherData.timetable || []
      });

      await newDoc.save();
      insertedCount++;
    }

    console.log(`✅ Migration complete. ${insertedCount} teacher documents created.`);
    process.exit();
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrateData();

// ...existing code...

const displaySets = displaySetService.getActiveDisplaySets();

if (!displaySets || displaySets.length === 0) {
  console.warn('No active display sets found.');
} else {
  const displaySetInstanceUID = displaySets[0]?.displaySetInstanceUID;
  console.log('Display Set Instance UID:', displaySetInstanceUID);

  if (!displaySetInstanceUID) {
    console.warn('No displaySetInstanceUID found in the first display set.');
  } else {
    const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);
    console.log('Display Set:', displaySet);

    if (!displaySet) {
      console.warn('No display set found for UID:', displaySetInstanceUID);
    } else if (!displaySet.metadata) {
      console.warn('No metadata found in display set:', displaySet);
    } else {
      // Access metadata (example fields)
      const patientName = displaySet.metadata.PatientName || 'Unknown';
      const studyDate = displaySet.metadata.StudyDate || 'Unknown';

      console.log('Patient Name:', patientName);
      console.log('Study Date:', studyDate);
    }
  }
}

// ...existing code...


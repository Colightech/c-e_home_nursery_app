
const validateChildBusinessRules = (child) => {
  // address
  if (child.address && child.address.trim().length < 5) {
    throw new Error("Address is too short");
  }

  // home language
  const allowedLanguages = ["English", "French", "Spanish", "Arabic"];
  if (
    child.homeLanguage &&
    !allowedLanguages.includes(child.homeLanguage)
  ) {
    throw new Error("Invalid home language");
  }

  // pickup password
  if (child.pickupPassword && child.pickupPassword.length < 4) {
    throw new Error("Pickup password too short");
  }

  // emergency contacts
  if (child.emergencyContacts) {
    if (child.emergencyContacts.length === 0) {
      throw new Error("At least one emergency contact is required");
    }

    child.emergencyContacts.forEach((c) => {
      if (!c.name || !c.phone) {
        throw new Error("Emergency contact must include name and phone");
      }
    });
  }

  // medical info
  if (child.medicalInfo) {
    const m = child.medicalInfo;

    if (m.allergies?.hasAllergies && !m.allergies.details) {
      throw new Error("Allergy details required");
    }

    if (m.medicalConditions?.hasCondition && !m.medicalConditions.details) {
      throw new Error("Medical condition details required");
    }
  }

  // doctor
  if (child.doctor) {
    if (!child.doctor.name || !child.doctor.phone) {
      throw new Error("Doctor name and phone required");
    }
  }

  // verification (strict)
  if (child.verification) {
    throw new Error("Verification cannot be set manually");
  }

  // authorized contacts
  if (child.authorizedContacts) {
    child.authorizedContacts.forEach((c) => {
      if (!c.name || !c.relationship) {
        throw new Error("Authorized contact incomplete");
      }
    });
  }
};

module.exports = validateChildBusinessRules;

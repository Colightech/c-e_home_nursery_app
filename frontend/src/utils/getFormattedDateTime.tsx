
const getFormattedDateTime = () => {
  const now = new Date();

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const dayName = days[now.getDay()];
  const day = now.getDate();
  const year = now.getFullYear();

  // 👇 Add ordinal (st, nd, rd, th)
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const ordinal = getOrdinal(day);

  // 👇 Time formatting (12hr)
  let hours: number | string = now.getHours();
  const minutes: number | string = now.getMinutes().toString().padStart(2, "0");
  const seconds: number | string = now.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 → 12

  return `${dayName} ${day}${ordinal} ${year}: ${hours}:${minutes}:${seconds} ${ampm}`;
};



export default getFormattedDateTime;
const rides = [
  {
    id: "r1",
    driver: { name: "Arjun Sharma", rating: 4.8, avatar: "AS", verified: true },
    from: "Chennai",
    to: "Bangalore",
    date: "2026-04-20",
    time: "06:00 AM",
    seats: 3,
    price: 450,
    vehicle: { model: "Toyota Innova", color: "White", plate: "TN 01 AB 1234" },
    amenities: ["AC", "Music", "No Smoking"],
    contact: "+91 98765 43210"
  },
  {
    id: "r2",
    driver: { name: "Priya Nair", rating: 4.9, avatar: "PN", verified: true },
    from: "Bangalore",
    to: "Ooty",
    date: "2026-04-21",
    time: "07:30 AM",
    seats: 2,
    price: 380,
    vehicle: { model: "Honda City", color: "Silver", plate: "KA 05 CD 5678" },
    amenities: ["AC", "Pet Friendly"],
    contact: "+91 87654 32109"
  },
  {
    id: "r3",
    driver: { name: "Suresh Kumar", rating: 4.6, avatar: "SK", verified: false },
    from: "Coimbatore",
    to: "Munnar",
    date: "2026-04-22",
    time: "05:00 AM",
    seats: 4,
    price: 290,
    vehicle: { model: "Maruti Ertiga", color: "Grey", plate: "TN 37 EF 9012" },
    amenities: ["AC", "Music"],
    contact: "+91 76543 21098"
  },
  {
    id: "r4",
    driver: { name: "Kavitha Reddy", rating: 4.7, avatar: "KR", verified: true },
    from: "Hyderabad",
    to: "Hampi",
    date: "2026-04-23",
    time: "08:00 AM",
    seats: 3,
    price: 520,
    vehicle: { model: "Mahindra XUV700", color: "Black", plate: "TS 09 GH 3456" },
    amenities: ["AC", "Music", "Charging Point"],
    contact: "+91 65432 10987"
  },
  {
    id: "r5",
    driver: { name: "Rahul Menon", rating: 4.5, avatar: "RM", verified: true },
    from: "Kochi",
    to: "Alleppey",
    date: "2026-04-24",
    time: "09:00 AM",
    seats: 2,
    price: 180,
    vehicle: { model: "Swift Dzire", color: "Blue", plate: "KL 07 IJ 7890" },
    amenities: ["AC"],
    contact: "+91 54321 09876"
  },
  {
    id: "r6",
    driver: { name: "Meena Iyer", rating: 4.9, avatar: "MI", verified: true },
    from: "Chennai",
    to: "Pondicherry",
    date: "2026-04-25",
    time: "10:00 AM",
    seats: 3,
    price: 220,
    vehicle: { model: "Honda Jazz", color: "Red", plate: "TN 22 KL 2345" },
    amenities: ["AC", "Music", "No Smoking"],
    contact: "+91 43210 98765"
  }
];

module.exports = rides;

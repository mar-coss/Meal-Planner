export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Meal Planner API is running on Vercel' 
  });
}
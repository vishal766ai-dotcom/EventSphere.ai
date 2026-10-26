import express from 'express';

const router = express.Router();

let activePools = [
  {
    poolId: "POOL-COLLEGE-FAREWELL",
    title: "Batch of '26 Farewell Gala & DJ Night",
    organizerName: "Tanmay & Riya",
    targetAmount: 30000,
    collectedAmount: 24500,
    status: "FUNDING", // FUNDING -> TARGET_REACHED -> AUTO_DISPATCHED
    packageTitle: "Cyber Neon Milestone Lounge + Live DJ Rig",
    shareableLink: "https://eventsphere.app/pool/COLLEGE-FAREWELL",
    upiId: "eventsphere.farewell26@okhdfcbank",
    contributors: [
      { name: "Rahul S.", amount: 2000, time: "10 mins ago", note: "Let's make it legendary guys!" },
      { name: "Sneha P.", amount: 2500, time: "25 mins ago", note: "Best batch ever!" },
      { name: "Aditya Roy", amount: 5000, time: "1 hour ago", note: "Sponsored extra dessert plinth 🎂" },
      { name: "Megha Rao", amount: 3000, time: "2 hours ago", note: "See you all on the dance floor!" },
      { name: "Kunal M.", amount: 4000, time: "3 hours ago", note: "Class of 2026 rock on!" },
      { name: "Anish K.", amount: 8000, time: "Yesterday", note: "Initial seed contribution" }
    ],
    autoDispatchTriggered: false
  }
];

// Get pool by ID
router.get('/:poolId', (req, res) => {
  const pool = activePools.find(p => p.poolId === req.params.poolId);
  if (!pool) return res.status(404).json({ error: "Contribution pool not found" });

  const progressPercent = Math.min(100, Math.round((pool.collectedAmount / pool.targetAmount) * 100));

  res.json({
    ...pool,
    progressPercent,
    remainingAmount: Math.max(0, pool.targetAmount - pool.collectedAmount)
  });
});

// Create new crowd pool
router.post('/create', (req, res) => {
  const { title, organizerName, targetAmount, packageTitle } = req.body;

  const target = Number(targetAmount) || 25000;
  const poolId = `POOL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const newPool = {
    poolId,
    title: title || "Group Celebration Fund",
    organizerName: organizerName || "Event Host",
    targetAmount: target,
    collectedAmount: 0,
    status: "FUNDING",
    packageTitle: packageTitle || "Express Celebration Package",
    shareableLink: `https://eventsphere.app/pool/${poolId}`,
    upiId: `eventsphere.${poolId.toLowerCase()}@okhdfcbank`,
    contributors: [],
    autoDispatchTriggered: false
  };

  activePools.push(newPool);

  res.status(201).json({
    success: true,
    message: "Shared contribution pool created! Share UPI link with group.",
    pool: newPool
  });
});

// Contribute via simulated UPI
router.post('/:poolId/contribute', (req, res) => {
  const { poolId } = req.params;
  const { contributorName, amount, note } = req.body;

  const pool = activePools.find(p => p.poolId === poolId);
  if (!pool) return res.status(404).json({ error: "Pool not found" });

  const contAmt = Number(amount);
  if (!contAmt || contAmt <= 0) return res.status(400).json({ error: "Invalid contribution amount" });

  pool.collectedAmount += contAmt;
  pool.contributors.unshift({
    name: contributorName || "Anonymous Friend",
    amount: contAmt,
    time: "Just now",
    note: note || "Congrats & celebrations! 🥳"
  });

  // Check if target reached
  let autoDispatchMessage = null;
  if (pool.collectedAmount >= pool.targetAmount && !pool.autoDispatchTriggered) {
    pool.status = "TARGET_REACHED";
    pool.autoDispatchTriggered = true;
    autoDispatchMessage = "🎯 100% Target Met! EventSphere Smart Escrow has locked the funds and automatically dispatched the nearest verified gig decorators and baker.";
  }

  const progressPercent = Math.min(100, Math.round((pool.collectedAmount / pool.targetAmount) * 100));

  res.json({
    success: true,
    message: `Thank you ${contributorName || 'friend'}! ₹${contAmt.toLocaleString('en-IN')} added to the group pool.`,
    pool: {
      ...pool,
      progressPercent,
      remainingAmount: Math.max(0, pool.targetAmount - pool.collectedAmount)
    },
    autoDispatchNotification: autoDispatchMessage
  });
});

export default router;

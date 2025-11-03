// cleanupController.js
const { label, confidence } = await aiService.classifyImage(buffer);

// Create classification record
await Classification.create({
    fileId, userId, challengeId, category: label, confidence
});

// Update challenge totals
await Challenge.findByIdAndUpdate(challengeId, {
    $inc: {
        "totals.items": 1,
        [`totals.wasteBreakdown.${label}`]: 1
    }
});

// Update user totals too
await User.findByIdAndUpdate(userId, { $inc: { "totals.items": 1 } });

// Emit real-time event
io.emit("stats:update", { label, confidence });

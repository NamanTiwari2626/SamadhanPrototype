const express = require('express');
const StudyPlan = require('../models/StudyPlan');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all study plans for user
router.get('/', auth, async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = { user: req.user._id };
    
    if (status) filter.status = status;
    if (category) filter.category = category;

    const plans = await StudyPlan.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({ plans });
  } catch (error) {
    console.error('Fetch study plans error:', error);
    res.status(500).json({ message: 'Failed to fetch study plans' });
  }
});

// Create new study plan
router.post('/', auth, async (req, res) => {
  try {
    const planData = {
      ...req.body,
      user: req.user._id
    };

    const plan = new StudyPlan(planData);
    await plan.save();

    // Award XP for creating a plan
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    await user.addXP(15);

    res.status(201).json({
      message: 'Study plan created successfully',
      plan
    });
  } catch (error) {
    console.error('Create study plan error:', error);
    res.status(500).json({ message: 'Failed to create study plan' });
  }
});

// Get specific study plan
router.get('/:id', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Fetch study plan error:', error);
    res.status(500).json({ message: 'Failed to fetch study plan' });
  }
});

// Update study plan
router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, 'progress.lastUpdated': Date.now() },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    res.json({
      message: 'Study plan updated successfully',
      plan
    });
  } catch (error) {
    console.error('Update study plan error:', error);
    res.status(500).json({ message: 'Failed to update study plan' });
  }
});

// Update progress
router.patch('/:id/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    
    const plan = await StudyPlan.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    plan.current.value = progress;
    plan.current.lastUpdated = Date.now();
    
    // Check if plan is completed
    if (plan.progress.percentage >= 100 && plan.status === 'active') {
      plan.status = 'completed';
      plan.completedAt = Date.now();
      
      // Award completion XP
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      await user.addXP(50);
    }

    await plan.save();

    res.json({
      message: 'Progress updated successfully',
      plan: {
        id: plan._id,
        progress: plan.progress,
        status: plan.status
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

// Add milestone
router.post('/:id/milestones', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    plan.milestones.push(req.body);
    await plan.save();

    res.json({
      message: 'Milestone added successfully',
      milestones: plan.milestones
    });
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ message: 'Failed to add milestone' });
  }
});

// Complete milestone
router.patch('/:id/milestones/:milestoneId/complete', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    const milestone = plan.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.completed = true;
    milestone.completedAt = Date.now();
    await plan.save();

    // Award XP for completing milestone
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    await user.addXP(10);

    res.json({
      message: 'Milestone completed successfully',
      milestone
    });
  } catch (error) {
    console.error('Complete milestone error:', error);
    res.status(500).json({ message: 'Failed to complete milestone' });
  }
});

// Delete study plan
router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    res.json({ message: 'Study plan deleted successfully' });
  } catch (error) {
    console.error('Delete study plan error:', error);
    res.status(500).json({ message: 'Failed to delete study plan' });
  }
});

// Get analytics for all plans
router.get('/analytics/overview', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const analytics = await StudyPlan.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalPlans: { $sum: 1 },
          completedPlans: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          activePlans: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          averageProgress: { $avg: '$progress.percentage' },
          totalMilestones: { $sum: { $size: '$milestones' } },
          completedMilestones: {
            $sum: {
              $size: {
                $filter: {
                  input: '$milestones',
                  cond: { $eq: ['$$this.completed', true] }
                }
              }
            }
          }
        }
      }
    ]);

    res.json({
      analytics: analytics[0] || {
        totalPlans: 0,
        completedPlans: 0,
        activePlans: 0,
        averageProgress: 0,
        totalMilestones: 0,
        completedMilestones: 0
      }
    });
  } catch (error) {
    console.error('Study plan analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

module.exports = router;
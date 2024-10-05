const Group = require('../models/group.model.js'); 

const createNewGroup = async (req, res) => {
    const { groupName, symbol, groupMembers, totalGroupSpending } = req.body;

    if (!groupName || !symbol || !Array.isArray(groupMembers)) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    const newGroup = new Group({
        groupName,
        symbol,
        groupMembers,
        totalGroupSpending
    });

    try {
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateMembersAmount = async (req, res) => {
    const { expenseTitle, groupId, time, payerId, amountPaid, membersPaidFor, category } = req.body;

    if (!expenseTitle || !time || !groupId || !payerId || typeof amountPaid !== 'number' || !Array.isArray(membersPaidFor)) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const payer = group.groupMembers.id(payerId);
        if (!payer) {
            return res.status(404).json({ message: "Payer not found" });
        }

        // Calculate the individual share each member has to pay
        const totalMembers = membersPaidFor.length;
        const individualShare = amountPaid / totalMembers;

        // Update balances for each member
        group.groupMembers.forEach(member => {
            // Check if the member is in the membersPaidFor list
            if (membersPaidFor.includes(member._id.toString())) {
                // Subtract the individual share from the member's current balance
                member.balance += individualShare;
            }
            if (member._id.toString() === payerId) {
                // Add the total amount paid to the payer's current balance
                member.balance -= amountPaid;
                // console.log('member.paid', member.name);
            }
        });

        // Add the expense to the group's expenses history
        const newExpense = {
            expenseTitle,
            time,
            paidBy: payer.name,
            paidFor: membersPaidFor.map(id => group.groupMembers.id(id).name),
            amount: amountPaid,
            category: category
        };

        group.expensesHistory.unshift(newExpense);

        // Update the group's total spending
        group.totalGroupSpending += amountPaid;

        await group.save();
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find({});
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGroup = async (req, res)=>{
    const {groupId} = req.params;

    if(!groupId){
        return res.status(400).json({messgae: "Group ID is required"});
    }

    try {
        const group = await Group.findByIdAndDelete(groupId);

        if(!group){
            return res.status(404).json({message: "Group not found"});
        }

        return res.status(200).json({message: "group Deleted Successfully", group});
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const fetchGroupById = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteExpense = async (req, res) => {
    const { groupId, expenseId } = req.params;

    if (!groupId || !expenseId) {
        return res.status(400).json({ message: "Group ID and Expense ID are required" });
    }

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const expense = group.expensesHistory.id(expenseId);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // Calculate the amount each member owes based on the original expense
        const totalMembers = expense.paidFor.length;
        const individualShare = expense.amount / totalMembers;

        // Adjust the balances of the payer and each member
        const payer = group.groupMembers.find(member => member.name === expense.paidBy);
        if (!payer) {
            return res.status(404).json({ message: "Payer not found" });
        }

        group.groupMembers.forEach(member => {
            // If the member was included in the paidFor list, revert their current balance
            if (expense.paidFor.includes(member.name)) {
                member.balance -= individualShare;
            }
            // Subtract the total amount from the payer's balance
            if (member.name === payer.name) {
                member.balance += expense.amount;
            }
        });

        // Revert the group's total spending
        group.totalGroupSpending -= expense.amount;

        // Remove the expense from the history
        group.expensesHistory = group.expensesHistory.filter(exp => exp._id.toString() !== expenseId);

        await group.save();
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateExpense = async (req, res) => {
    const { groupId, expenseId } = req.params;
    const { expenseTitle, amount, time, category, paidBy, paidFor } = req.body;

    if (!groupId || !expenseId) {
        return res.status(400).json({ message: "Group ID and Expense ID are required" });
    }

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const expense = group.expensesHistory.id(expenseId);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // Update expense details
        expense.expenseTitle = expenseTitle || expense.expenseTitle;
        expense.amount = amount || expense.amount;
        expense.time = time || expense.time;
        expense.category = category || expense.category;
        expense.paidBy = paidBy || expense.paidBy;
        expense.paidFor = paidFor || expense.paidFor;

        await group.save();

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createNewGroup,
    updateMembersAmount,
    getAllGroups,
    deleteGroup,
    fetchGroupById,
    deleteExpense,
    updateExpense
};

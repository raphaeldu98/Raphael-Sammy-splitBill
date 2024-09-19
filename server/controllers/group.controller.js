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
    const { expenseTitle, groupId, time, payerId, amountPaid, membersPaidFor } = req.body;

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

        let isPayerInvolve = membersPaidFor.includes(payerId);
        let splitAmount;
        if(isPayerInvolve){
            splitAmount = amountPaid / (membersPaidFor.length-1);
        }else{
            splitAmount = amountPaid / membersPaidFor.length;
        }


        const membersPaidForNames = membersPaidFor.map(memberId => {
            const member = group.groupMembers.id(memberId);
            return member.name;
        });

        const raphael = membersPaidForNames.includes('Raphael') ? -(amountPaid / 2) : -amountPaid;
        const sammy = membersPaidForNames.includes('Raphael') ? amountPaid / 2 : amountPaid;

        group.groupMembers.forEach(member => {
            if(member.name === 'Raphael'){
                member.balance += raphael;
            }else if(member.name === 'Sammy'){
                member.balance += sammy;
            }
        });

        let paidFor = []
        let sum = 0;
        membersPaidFor.forEach(memberId => {
            const member = group.groupMembers.id(memberId);
            paidFor.push(member.name);
            if(member && member!==payerId) {
                member.currentBalance -= splitAmount;
                sum+=splitAmount;
            }
        });

        payer.currentBalance += sum;
        group.totalGroupSpending += amountPaid;

        const newExpenses = {
            expenseTitle,
            time,
            paidBy: payer.name,
            paidFor,
            amount:amountPaid,
        }

        group.expensesHistory.unshift(newExpenses);

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
    console.log('deleteExpense');
    const { groupId, expenseId } = req.params;

    console.log('!!!!', groupId, expenseId);
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

        group.totalGroupSpending -= expense.amount;

        const payer = group.groupMembers.find(member => member.name === expense.paidBy);
        payer.currentBalance -= expense.amount;

        const raphael = expense.paidFor.includes('Raphael') ? -(expense.amount / 2) : -expense.amount;
        const sammy = expense.paidFor.includes('Raphael') ? expense.amount / 2 : expense.amount;

        console.log('raphael', raphael);
        console.log('sammy', sammy);
        console.log('group.groupMembers', group.groupMembers);
        group.groupMembers.forEach(member => {
            if(member.name === 'Raphael'){
                member.balance -= raphael;
                console.log('member.balance', member.balance);
            }else if(member.name === 'Sammy'){
                member.balance -= sammy;
                console.log('member.balance', member.balance);
            }
        });

        expense.paidFor.forEach(memberName => {
            const member = group.groupMembers.find(member => member.name === memberName);
            member.currentBalance += expense.amount / expense.paidFor.length;
        });

        group.expensesHistory = group.expensesHistory.filter(exp => exp._id.toString() !== expenseId);

        await group.save();
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createNewGroup,
    updateMembersAmount,
    getAllGroups,
    deleteGroup,
    fetchGroupById,
    deleteExpense
};

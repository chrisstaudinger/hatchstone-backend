// Dependencies

// Import models
const Conversation = require('../models/Conversation')
const User = require('../models/User')
const Profile = require('../models/Profile')
const Message = require('../models/Message')

// POST /conversations
// create a new conversation
const create = async (req, res, next) => {
  try {
    const { clientUserId, adminUserId } = req.body
    // check to make sure conversation is between an admin and a client
    const clientUserObj = await User.findById(clientUserId)
    const adminUserObj = await User.findById(adminUserId)
    if (!(clientUserObj.admin === false && adminUserObj.admin === true)) {
      throw 'conversation must be between an admin and a client'
    }
    // search all existing conversations to check if a regular user already has a
    // conversation active with that particular admin user, if so return that conversation
    const allConversations = await Conversation.find()
    let existingConversation = null
    allConversations.forEach((conversation) => {
      const convoParticipants = conversation.participants
      if (
        convoParticipants.includes(adminUserId) &&
        convoParticipants.includes(clientUserId)
      ) {
        console.log('conversation already exists')
        existingConversation = conversation
        return res.send(existingConversation)
      }
    })
    // otherwise create a new conversation
    if (!existingConversation) {
      const newConversation = await Conversation.create({
        participants: [clientUserId, adminUserId],
      })
      return res.send(newConversation)
    }
  } catch (err) {
    console.log(err)
    return res.status(404).send('an error occurred')
  }
}

// GET /conversations
// return all conversations
const index = async (req, res, next) => {
  try {
    const conversations = await Conversation.find().populate({
      path: 'participants',
      model: 'User',
    })
    return res.send(conversations)
  } catch (err) {
    console.log(err)
    return res.status(404).send('an error occurred')
  }
}

// GET /conversations/:id
// return a conversation by conversation id
const show = async (req, res, next) => {
  try {
    const { id } = req.params
    const conversation = await Conversation.findById(id).populate({
      path: 'participants',
      model: 'User',
    })
    return res.send(conversation)
  } catch (err) {
    console.log(err)
    return res.status(500).send('an error occurred')
  }
}

// GET /conversations/findByUser/:id
// return all conversations for a given user id. This custom object contains the profiles of each user
// as well as the conversatiom id and date created
const findByUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const allConversations = await Conversation.find()

    const userConversations = []
    allConversations.forEach((conversation) => {
      if (conversation.participants.includes(userId)) {
        userConversations.push(conversation)
      }
    })

    if (!userConversations.length) {
      return res.send([])
    }

    const getUserConversationsPopulated = async () => {
      // .map() will return an array of promises
      const userConversationsPopulated = userConversations.map(
        async (conversation) => {
          // get the clients profile
          const conversationPopulated = {
            participants: [],
            _id: null,
            messages: [],
          }

          // get profiles
          const clientUserId = conversation.participants[0]._id
          const clientProfile = await Profile.findOne({
            userId: clientUserId,
          }).populate({
            path: 'userId',
            model: 'User',
          })
          const adminUserId = conversation.participants[1]._id
          const adminProfile = await Profile.findOne({
            userId: adminUserId,
          }).populate({
            path: 'userId',
            model: 'User',
          })
          conversationPopulated.participants.push(clientProfile, adminProfile)

          // get conversation id
          conversationPopulated._id = conversation._id

          // get all messages for that conversation
          const messages = await Message.find({
            conversationId: conversation._id,
          }).populate({ path: 'author', model: 'User' })
          conversationPopulated.messages.push(...messages)
          return conversationPopulated
        },
      )
      // here we pass in the array of promises and wait till they are all resolved prior to returning
      return Promise.all(userConversationsPopulated).then()
    }

    const userConversationsPopulated = await getUserConversationsPopulated()
    res.send(userConversationsPopulated)
  } catch (err) {
    console.log(err)
    return res.status(500).send('an error occurred')
  }
}

// PUT /conversations/:id
// update a conversation by conversation id
const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const { clientUser, adminUser } = req.body
    const updatedConversation = await Conversation.findByIdAndUpdate(id, {
      participants: [clientUser, adminUser],
    })
    return res.send(updatedConversation)
  } catch (err) {
    console.log(err)
    return res.status(500).send('an error occurred')
  }
}

// DELETE /conversations/:id
// delete a conversation by conversation id
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedConversation = await Conversation.findByIdAndDelete(id)
    return res.send(deletedConversation)
  } catch (err) {
    console.log(err)
    res.status(500).send('an error occurred')
  }
}

module.exports = {
  create,
  index,
  show,
  update,
  findByUser,
  destroy,
}

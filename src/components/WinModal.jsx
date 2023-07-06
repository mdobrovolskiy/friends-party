import React from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useParams } from 'react-router-dom'
const WinModal = ({ users, currentTeamLeader, maxPointer }) => {
  const params = useParams()
  const restartGame = async () => {
    users.forEach(async (user) => {
      if (user.isAdmin) {
        const userRef = doc(db, `usersId=${params.id}`, user.id)
        await updateDoc(userRef, {
          isAdmin: true,
          team: 0,
          isReady: false,
          currentTeamMove: 1,
          isGameStarted: false,
          isRoundEnded: false,
          isRoundStarted: false,
          moverLimit: 1,
          nextMove: 0,
          teamScore: 0,
          timeLeft: 60,
          uniqueId: Date.now(),
          winPoints: 20,
          isGameEnded: false,
          entryPointScore: 0,
        })
      } else {
        const userRef = doc(db, `usersId=${params.id}`, user.id)
        await updateDoc(userRef, {
          isAdmin: false,
          team: 0,
          isReady: false,
          teamScore: 0,
          entryPointScore: 0,
          nextMove: 0,
        })
      }
    })
  }
  return (
    <div className="winWrapper">
      <div className="winModal">
        <div className="congrats">
          Congratulations to {maxPointer.userName}'s team
        </div>
        <div className="trophy">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3132/3132778.png"
            alt=""
          />
        </div>

        <div className="playAgain">
          <button onClick={restartGame}>Play again</button>
        </div>
      </div>
    </div>
  )
}

export default WinModal

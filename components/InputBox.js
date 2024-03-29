import { useSession } from "next-auth/react"
import Image from "next/image"
import { EmojiHappyIcon } from "@heroicons/react/outline"
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid"
import { useRef, useState } from "react"
import { db, storage } from "../firebase"
import firebase from "firebase/compat/app"


function InputBox() {
  const {data: session} = useSession()
  const inputRef = useRef(null) // ito yung magbabantay sa tinatype
  const filepickerRef = useRef(null)

  // imageToPost will become a bunch of text that will converted to image
  const [imageToPost, setImageToPost] = useState(null)


  const sendPost = e => {
    e.preventDefault()

    // kapag walang laman, wala kang gagawin
    if(!inputRef.current.value) return

    // yung timestamp kukunin natin kung nasan located yung database natin
    db.collection('posts').add({
        message: inputRef.current.value,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(doc => {
        // kapag yung sinubmit na form may kasamang image
        if(imageToPost) {
            // submit the image to storage
            const uploadTask = storage.ref(`posts/${doc.id}`).putString(imageToPost, 'data_url')
            removeImage() // reset the image after upload

            // 1. when the state change occurs
            // 2. this will be the progress but I dont wanna do something about the progress
            // 3. when something went wrong
            // 4. when upload completes
            uploadTask.on('state_change', null, error => console.error(error), () => {
                // when the upload completes
                storage.ref('posts')
                       .child(doc.id)
                       .getDownloadURL()
                       .then(url => {
                            db.collection('posts')
                              .doc(doc.id)
                              .set({
                                postImage: url
                               }, 
                               { 
                                merge: true 
                               }
                              )
                        })
            })
        }
    })

    // empty the input field
    inputRef.current.value = ''
  }

  const addImageToPost = e => {
    const reader = new FileReader()
    if(e.target.files[0]){
        reader.readAsDataURL(e.target.files[0]) // binasa nya yung file
    }

    reader.onload = (readerEvent) => {
        setImageToPost(readerEvent.target.result) // nilagay sa state yung DataURL
    }
  }

  // state removal
  const removeImage = () => {
    setImageToPost(null)
  }

  return (
    <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
        <div className="flex space-x-4 p-4 items-center">
            <Image 
                className="rounded-full"
                src={session.user.image}
                width={40}
                height={40}
                layout="fixed"
            />
            <form className="flex flex-1">
                <input 
                    className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none" 
                    type="text" 
                    ref={inputRef}
                    placeholder={`What's on your mind, ${session.user.name}?`}
                />
                <button hidden type="submit" onClick={sendPost}>Submit</button>
            </form>

            {/* if image submitted, show it */}
            {imageToPost && (
                <div onClick={removeImage} className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer">
                    <img className="h-10 object-contain" src={imageToPost} alt="" />
                    <p className="text-xs text-red-500 text-center">Remove</p>
                </div>
            )}
        </div>

        <div className="flex justify-evenly p-3 border-t">
            <div className="inputIcon">
                <VideoCameraIcon className="h-7 text-red-500" />
                <p className="text-xs sm:text-sm xl:text-base">Live Video</p>
            </div>

            <div 
                onClick={() => filepickerRef.current.click()} 
                className="inputIcon"
            >
                <CameraIcon className="h-7 text-green-400" />
                <p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
                <input ref={filepickerRef} onChange={addImageToPost} type="file" hidden />
            </div>
            
            <div className="inputIcon">
                <EmojiHappyIcon className="h-7 text-yellow-300" />
                <p className="text-xs sm:text-sm xl:text-base">Feeling/Activity</p>
            </div>
        </div>
    </div>
  )
}

export default InputBox
import { CameraIcon, MicrophoneIcon, ChatBubbleIcon } from '../../icons/System'

export default function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 pt-2">
      <div className="flex items-center gap-3 bg-white rounded-full px-3 py-2 shadow-lg border border-gray-100">
        <button className="w-11 h-11 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100">
          <CameraIcon size={22} />
        </button>
        <button className="w-11 h-11 rounded-full flex items-center justify-center bg-teal-700 text-white shadow-md">
          <MicrophoneIcon size={22} />
        </button>
        <button className="w-11 h-11 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100">
          <ChatBubbleIcon size={22} />
        </button>
      </div>
    </div>
  )
}
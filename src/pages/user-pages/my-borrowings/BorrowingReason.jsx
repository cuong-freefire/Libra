import './borrowing.css'
import { CircleX } from 'lucide-react';

export default function BorrowingReason({ borrowing, onClose }) {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-opacity-75 bg-white z-3">
            <div className='bg-white border border-black border-1 rounded shadow-lg'>
                <div className="d-flex justify-content-end bg-black mb-3"><button onClick={onClose}><CircleX /></button></div>
                <div style={{ width: '450px' }}>
                    <h3 className='text-center'>Lý do/Ghi chú phiếu mượn</h3>
                    <p className='text-center'>Sách: {borrowing.book.title}</p>
                    <div className="my-3">
                        {
                            borrowing.rejectReason ?
                                <div className="description my-3 mx-3 border border-1 border-black rounded">
                                    <p className='px-3 py-3'>{borrowing.rejectReason}</p>
                                    {/* <p className='px-3 py-3'>Bạn làm mất sách của chúng tôi 3 lần? Và giờ bạn muốn mượn tiếp à duma?</p> */}
                                </div> :
                                borrowing.returnNote ?
                                    <div className="description my-3 mx-3 border border-1 border-black rounded">
                                        <p className='px-3 py-3'>{borrowing.returnNote}</p>
                                    </div> :
                                    <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

import './BoxShadowLoader.css';

const BoxShadowLoader = () => {
  return (
    <div className='loader-wrapper'>
        <div className='load-text'>Loding...</div>
        <div className='loader'>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>            
        </div>
    </div>
  )
}

export default BoxShadowLoader
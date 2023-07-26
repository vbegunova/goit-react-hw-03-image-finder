// import ReactModal from 'react-modal';
import { Component } from 'react';
import { ModalContainer, Overlay, Image } from './Modal.styled';

// const customStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)',
//   },
// };

// ReactModal.setAppElement('#root');

// const Modal = ({ isOpen, image, onClose }) => {
//   return (
//     <ReactModal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       style={customStyles}
//       contentLabel="Example Modal"
//     >
//       <Image src={image} alt="ImageAlt" />
//     </ReactModal>
//   );
// };

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = e => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };
  handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    return (
      <>
        <Overlay onClick={this.handleBackdropClick}>
          <ModalContainer>
            <Image src={this.props.image} alt="ImageAlt" loading="lazy" />
          </ModalContainer>
        </Overlay>
      </>
    );
  }
}

export default Modal;

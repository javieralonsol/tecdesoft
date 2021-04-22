import React from 'react';

export default function Modal({ modalContent, setModalContent }) {
  [...document.querySelectorAll('header, main, footer')].map((element) =>
    element.classList[modalContent ? 'add' : 'remove']('blur')
  );

  const closeModal = () => {
    document.querySelector('.modal').classList.remove('modal-visible-on');
    setTimeout(() => setModalContent(''), 200);
    [...document.querySelectorAll('header, main, footer')].map((element) => element.classList.remove('blur'));
  };

  setTimeout(() => document.querySelector('.ok-close-button')?.focus(), 200);

  return (
    <aside className={`modal${modalContent && ' modal-visible-on'}`}>
      <div className="modal-contenido">
        <label htmlFor="modalCloseButton">Close button</label>
        <button className="button modal-contenido-close" id="modalCloseButton" onClick={closeModal}>
          Close button
        </button>
        <div>
          <div className="max-width" dangerouslySetInnerHTML={{ __html: modalContent }}></div>
          <button className="ok-close-button" onClick={closeModal} autoFocus>
            Cerrar
          </button>
        </div>
      </div>
    </aside>
  );
}

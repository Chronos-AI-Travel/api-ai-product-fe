import { useRouter } from 'next/router';

const FormSubmittedModal = ({ setShowModal }) => {
  const router = useRouter();

  return (
    <div className="modalBackground text-black">
    <div className="modalContainer w-3/4 md:w-1/2 lg:w-1/2 flex flex-col gap-4">

        <p className='text-3xl'>Form submitted and calendly event scheduled.</p>
        <button className='standard-button border' onClick={() => router.push('/')}>Return to homepage</button>
        <button className='standard-button bg-teal-300 text-slate-900' onClick={() => router.push('/dashboard')}>Sign up and take a glimpse at our Admin Panel</button>
      </div>
    </div>
  );
};

export default FormSubmittedModal;
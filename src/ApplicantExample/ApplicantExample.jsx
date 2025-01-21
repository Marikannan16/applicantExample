import React, { useState } from 'react';

const Example = () => {
    const [modelOpen, setModelOpen] = useState(false);
    const [appName, setAppName] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [currentApplicantIndex, setCurrentApplicantIndex] = useState(0);
    const [documents, setDocuments] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (appName.trim() !== '') {
            setApplicants([...applicants, appName]);
            setDocuments({ ...documents, [appName]: [] });
            setCurrentApplicantIndex(applicants.length);
        }
        setAppName('');
        setModelOpen(false);
    };

    const handleCancel = () => {
        setAppName('');
        setModelOpen(false);
    };

    const handleDeleteApplicant = (index) => {
        const updatedApplicants = applicants.filter((_, i) => i !== index);
        const updatedDocuments = { ...documents };
        delete updatedDocuments[applicants[index]];
        setApplicants(updatedApplicants);
        setDocuments(updatedDocuments);

        if (currentApplicantIndex >= updatedApplicants.length) {
            setCurrentApplicantIndex(Math.max(0, updatedApplicants.length - 1));
        }
    };

    const handleNext = () => {
        if (currentApplicantIndex < applicants.length - 1) {
            setCurrentApplicantIndex(currentApplicantIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentApplicantIndex > 0) {
            setCurrentApplicantIndex(currentApplicantIndex - 1);
        }
    };

    const handleDocumentUpload = (files) => {
        const applicantName = applicants[currentApplicantIndex];
        const uploadedFiles = files.map((file) => ({
            name: file.name,
            status: 'Pending Upload',
        }));
        const updatedDocuments = {
            ...documents,
            [applicantName]: [...(documents[applicantName] || []), ...uploadedFiles],
        };
        setDocuments(updatedDocuments);
    };

    const handleDocumentStatusChange = (fileIndex, newStatus) => {
        const applicantName = applicants[currentApplicantIndex];
        const updatedFiles = [...documents[applicantName]];
        updatedFiles[fileIndex].status = newStatus;
        setDocuments({ ...documents, [applicantName]: updatedFiles });
    };

    const handleDocumentDelete = (fileIndex) => {
        const applicantName = applicants[currentApplicantIndex];
        const updatedFiles = documents[applicantName].filter(
            (_, index) => index !== fileIndex
        );
        setDocuments({ ...documents, [applicantName]: updatedFiles });
    };

    const currentApplicantName = applicants[currentApplicantIndex];
    const currentDocuments = documents[currentApplicantName] || [];

    return (
        <div className="h-full w-full">
            <div className="h-16 border w-full bg-gray-50 flex justify-between items-center px-10">
                <h1 className="text-2xl font-bold">Document Upload</h1>
                <button
                    className="bg-blue-500 p-2 rounded-lg text-white border h-10 w-36 flex justify-between items-center"
                    onClick={() => setModelOpen(!modelOpen)}
                >
                    <p className="text-2xl">+</p>
                    <p>Add Applicant</p>
                </button>
            </div>

            <div className="h-16 border w-full bg-gray-100 flex gap-4 px-10 overflow-x-auto">
                {applicants.map((name, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentApplicantIndex(index)}
                        className={`flex justify-center h-14 items-center px-3 py-2 rounded-lg shadow-md gap-6 cursor-pointer ${index === currentApplicantIndex
                            ? 'border-b-4 border-blue-500'
                            : 'border-b-4 border-gray-300'
                            }`}
                    >
                        <span>{name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteApplicant(index);
                            }}
                            className="rounded h-8 w-8 bg-blue-500 p-2 flex justify-center items-center text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>

                        </button>
                    </div>
                ))}
            </div>

            <div className="p-5">
                {currentApplicantName ? (
                    currentDocuments.length === 0 ? (
                        <div className="text-center">
                            <p>No documents available</p>
                            <div
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleDocumentUpload([...e.dataTransfer.files]);
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                className="mt-4 border-dashed border-2 border-gray-400 rounded-lg p-10 cursor-pointer"
                            >
                                <p>Drag and drop documents here</p>
                                <p>or</p>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleDocumentUpload([...e.target.files])}
                                    className="hidden"
                                    id="fileUpload"
                                />
                                <label
                                    htmlFor="fileUpload"
                                    className="text-blue-500 underline cursor-pointer"
                                >
                                    Browse Files
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div>

                            <div
                                className="mt-4 border-dashed border-2 border-gray-400 rounded-lg p-10 cursor-pointer"
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleDocumentUpload([...e.dataTransfer.files]);
                                }}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <p>Drag and drop more documents here</p>
                                <p>or</p>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleDocumentUpload([...e.target.files])}
                                    className="hidden"
                                    id="additionalFileUpload"
                                />
                                <label
                                    htmlFor="additionalFileUpload"
                                    className="text-blue-500 underline cursor-pointer"
                                >
                                    Browse More Files
                                </label>
                            </div>
                            <h2 className="text-xl font-bold mb-4">Uploaded Documents</h2>
                            <ul className="list-none">
                                {currentDocuments.map((doc, index) => (
                                    <li
                                        key={index}
                                        className="flex flex-col justify-between lg:flex-row  items-center flex-wrap mb-2 p-2 border rounded"
                                    >
                                        <span className='flex flex-wrap flex-col lg:flex-row  justify-between gap-4 items-center '>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>

                                            {doc.name}</span>
                                        <span className="flex gap-2 items-center">
                                            <span
                                                className={`text-sm px-2 py-1 rounded ${doc.status === 'Success'
                                                    ? 'bg-green-200'
                                                    : 'bg-orange-300'
                                                    }`}
                                            >
                                                {doc.status}
                                            </span>
                                            {doc.status === 'Pending Upload' && (
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded flex justify-center items-center gap-2"
                                                    onClick={() =>
                                                        handleDocumentStatusChange(index, 'Success')
                                                    }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                                    </svg>

                                                    Upload
                                                </button>
                                            )}
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded flex justify-center items-center gap-2"
                                                onClick={() => handleDocumentDelete(index)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                                cancel
                                            </button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                ) : (
                    <div className="text-center">
                        <p className="text-gray-500"></p>
                    </div>
                )}
            </div>

            <div className="h-16 border w-full bg-gray-50 flex justify-between items-center px-10">
                <button
                    className={`bg-blue-500 p-2 rounded-lg text-white border h-10 w-36 flex justify-center items-center gap-5 ${currentApplicantIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    onClick={handlePrevious}
                    disabled={currentApplicantIndex === 0}
                >
                    <p>← Back</p>
                </button>
                <button
                    className={`bg-blue-500 p-2 rounded-lg text-white border h-10 w-36 flex justify-center items-center gap-5 ${currentApplicantIndex === applicants.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                        }`}
                    onClick={handleNext}
                    disabled={currentApplicantIndex === applicants.length - 1}
                >
                    <p>Next →</p>
                </button>
            </div>

            {modelOpen && (
                <div className="fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-transparent/35 px-4 py-5">
                    <div className="h-72 w-[30rem] bg-white rounded-2xl border p-3">
                        <span className="border-b flex justify-between items-center px-5 mt-5 pb-6">
                            <h1 className="text-2xl font-bold">Add Applicant</h1>
                            <button
                                type="button"
                                onClick={() => setModelOpen(!modelOpen)}
                                className="p-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </span>
                        <form className="p-3" onSubmit={handleSubmit}>
                            <label htmlFor="name" className="mt-2">
                                Name
                            </label>
                            <br />
                            <input
                                type="text"
                                id="name"
                                className="mt-2 w-full h-10 px-2 border rounded-md"
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                            />
                            <br />
                            <span className="flex justify-end items-center gap-4 mt-6">
                                <button
                                    type="submit"
                                    className="bg-blue-500 rounded-xl h-10 w-24 p-2 text-white"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-500 rounded-xl h-10 w-24 p-2 text-white"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </span>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Example;

"use client";
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function Assignments() {
    const [showForm, setShowForm] = useState(false);
    const [questions, setQuestions] = useState([{ text: '', options: ['Option #1', 'Option #2'] }]);
    const [weightage, setWeightage] = useState(0);
    const [formType, setFormType] = useState("");
    const [questionPrompt, setQuestionPrompt] = useState('');
    const [dueDate, setDueDate] = useState('');


    const handleAddOption = (questionIndex) => {
        setQuestions(questions.map((question, index) => {
            if (index === questionIndex) {
                return { ...question, options: [...question.options, `Option #${question.options.length + 1}`] };
            }
            return question;
        }));
    };

    const handleDeleteQuestion = (questionIndex) => {
        setQuestions(questions.filter((_, index) => index !== questionIndex));
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { text: '', options: ['Option #1', 'Option #2'] }]);
    };

    const handleCorrectOptionChange = (questionIndex, optionIndex) => {
        setQuestions(questions.map((question, index) => {
            if (index === questionIndex) {
                return { ...question, correctOption: optionIndex };
            }
            return question;
        }));
    };

    const handleWeightageChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 100) {
            setWeightage(value);
        } else {
            alert('Weightage must be a number between 0 and 100.');
        }
    };

    const handleAddQuizClick = () => {
        setFormType('quiz');
        setShowForm(true);
    };

    const handleAddEssayClick = () => {
        setFormType('essay');
        setShowForm(true);
    };

    const handleQuestionPromptChange = (e) => {
        setQuestionPrompt(e.target.value);
    };

    const handleDueDateChange = (e) => {
        setDueDate(e.target.value);
    };

    return (
        <div className="flex flex-col h-screen bg-blue-100 overflow-auto">
            <Sidebar />
            <div className="p-6 text-center w-full">
                <h1 className="text-3xl text-black font-semibold mb-4" data-testid="course-heading">Course Name</h1>
                <h2 className="text-3xl text-black font mt-4" data-testid="assignments-heading"> New Assignment</h2>
                <div className="flex flex-row items-center justify-center p-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-5" onClick={handleAddQuizClick}>Add Quiz</button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-5" onClick={handleAddEssayClick}>Add Essay</button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-5" onClick={handleAddQuestion}>Add Question</button>
                </div>
                {showForm && (
                    <>
                        <div className="flex flex-row items-center justify-center p-4 text-black font-semibold">
                            <label className="mr-2">Due Date:</label>
                            <input
                                type="date"
                                className="border border-gray-300 px-4 py-2 rounded-md text-black w-96 mb-4"
                                value={dueDate}
                                onChange={handleDueDateChange}
                            />
                        </div>
                        {formType === 'quiz' && (
                            <>
                                <div className="flex flex-row items-center justify-center p-4 text-black font-semibold">
                                    <label className="mr-2">Weightage of the quiz in the course:</label>
                                    <input type="number" value={weightage} onChange={handleWeightageChange} min="0" max="100" />
                                </div>
                                {questions.map((question, questionIndex) => (
                            
                            <div key={questionIndex} className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Enter question"
                                    className="border border-gray-300 px-4 py-2 rounded-md text-black w-96 mb-4"
                                    value={question.text}
                                    onChange={(e) => setQuestions(questions.map((q, i) => {
                                        if (i === questionIndex) {
                                            return { ...q, text: e.target.value };
                                        }
                                        return q;
                                    }))}
                                />
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-4" onClick={() => handleDeleteQuestion(questionIndex)}>Delete Question</button>
                                <h3 className="text-lg text-black font-semibold mb-2">Select Correct Option</h3>
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex flex-row justify-center items-center mt-2">
                                        <input
                                            type="radio"
                                            className='mx-10'
                                            checked={question.correctOption === optionIndex}
                                            onChange={() => handleCorrectOptionChange(questionIndex, optionIndex)}
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            className="border border-gray-300 px-4 py-2 rounded-md text-black w-64 mr-4"
                                            onChange={(e) => setQuestions(questions.map((q, i) => {
                                                if (i === questionIndex) {
                                                    return { ...q, options: q.options.map((o, j) => {
                                                        if (j === optionIndex) {
                                                            return e.target.value;
                                                        }
                                                        return o;
                                                    }) };
                                                }
                                                return q;
                                            }))}
                                        />
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setQuestions(questions.map((q, i) => {
                                            if (i === questionIndex) {
                                                return { ...q, options: q.options.filter((o, j) => j !== optionIndex) };
                                            }
                                            return q;
                                        }))}>Delete Option</button>
                                    </div>
                                ))}
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => handleAddOption(questionIndex)}>Add Option</button>
                                </div>
                                ))}
                            </>
                        )}
                        {formType === 'essay' && (
                            <>
                                <div className="flex flex-row items-center justify-center p-4 text-black font-semibold">
                                    <label className="mr-2">Weightage of the essay in the course:</label>
                                    <input type="number" value={weightage} onChange={handleWeightageChange} min="0" max="100" />
                                </div>
                                <div className="flex flex-row items-center justify-center p-4 text-black font-semibold">
                                    <label className="mr-2">Question Prompt:</label>
                                    <textarea
                                        className="border border-gray-300 px-4 py-2 rounded-md text-black w-96 mb-4"
                                        value={questionPrompt}
                                        onChange={handleQuestionPromptChange}
                                    />
                                </div>
                            </>
                        )}
                    </>
                    
                )}
            </div>
        </div>
    );
}
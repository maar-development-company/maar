import { useNavigate } from "react-router-dom";
import React from "react";

export const PageBackButton = () => {
	const navigate = useNavigate();
	const pageBack = () => {
		navigate(-1); // 前のページに遷移する
	};

	return (
		<button
			onClick={pageBack}
			className="bg-blue-800 hover:bg-blue-700 border-2 border-white text-white rounded px-4 py-2 w-30 mt-2 mr-3 text-xl flex flex-row">
			<span>戻る</span>
		</button>
	);
};

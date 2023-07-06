import React from "react";

export const Header = (props) => {
	const { municipality, userName } = props;

	return (
		<header className="w-full fixed top-0 bg-blue-800 text-white h-24 z-0">
			<p id="text-pop-up-top" className="text-4xl text-left ml-2 mb-1">
				{municipality}
			</p>
			<p id="text-pop-up-top2" className="text-4xl text-left ml-2 mt-2">
				{userName}さん
			</p>
		</header>
	);
};

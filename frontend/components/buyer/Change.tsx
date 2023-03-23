import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FunctionComponent, useEffect, useState } from 'react';
import { Coin } from '../../models/user';

interface Props {
	change: Array<Coin>;
}

interface ChangeObject {
	[key: number]: number;
}

export const Change: FunctionComponent<Props> = ({ change }: Props) => {
	const [changeObject, setChangeObject] = useState<ChangeObject>({});

	useEffect(() => {
		setChangeObject({});
		change.forEach((coin) => {
			setChangeObject((prev) => ({
				...prev,
				[coin]: prev[coin] ? prev[coin] + 1 : 1,
			}));
		});
	}, [change]);

	return (
		<Box>
			{Object.keys(changeObject).map((key, index) => (
				<Box key={index}>
					<Typography variant="body1">
						{changeObject[key]} * ${key}
					</Typography>
				</Box>
			))}
		</Box>
	);
};

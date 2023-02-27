import * as React from 'react';
import { forwardRef } from 'react';

// material-ui
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Slide,
	SlideProps,
	Stack,
	Typography,
} from '@mui/material';

// assets
import { TGetBook } from 'types/book';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
	data: TGetBook;
}

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

const Text = ({ label, value }: { label: string; value: string | number }) => (
	<Stack direction="row" spacing={1}>
		<Typography variant="subtitle1">{label} :</Typography>
		<Typography variant="body2" display="flex" alignItems="center">
			{value}
		</Typography>
	</Stack>
);

const BookDetails = ({ handleCloseDialog, data }: ProductAddProps) => {
	return (
		<Dialog
			open
			TransitionComponent={Transition}
			keepMounted
			onClose={handleCloseDialog}
			sx={{
				'&>div:nth-of-type(3)': {
					justifyContent: 'flex-end',
					'&>div': {
						m: 0,
						borderRadius: '0px',
						maxWidth: 450,
						maxHeight: '100%',
					},
				},
			}}
		>
			<DialogTitle>{data.title}</DialogTitle>
			<DialogContent>
				<Grid container spacing={1} sx={{ mt: 0.25 }}>
					<Grid item xs={12}>
						<Text label="ID" value={data.id} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Author" value={data.author} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Format" value={data.typeFormat} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Publishing House" value={data.publishingHouse} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Published Year" value={data.publishedYear} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Genre" value={data.genre} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Pages" value={data.pages} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Price" value={`${data.price} RON`} />
					</Grid>
					<Grid item xs={12}>
						<Text
							label="Stock New"
							value={`${data.stockNew} ${data.stockNew === 1 ? 'pc' : 'pcs'}`}
						/>
					</Grid>
					<Grid item xs={12}>
						<Text
							label="Stock Old"
							value={`${data.stockOld} ${data.stockOld === 1 ? 'pc' : 'pcs'}`}
						/>
					</Grid>
					<Grid item xs={12}>
						<Text
							label="Created At"
							value={Intl.DateTimeFormat('en-GB', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
							}).format(new Date(data.createdAt))}
						/>
					</Grid>
					<Grid item xs={12}>
						<Text
							label="Last Update"
							value={Intl.DateTimeFormat('en-GB', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
							}).format(new Date(data.updatedAt))}
						/>
					</Grid>
					<Grid item xs={12}>
						<Text label="Description" value={data.description} />
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-end',
				}}
			>
				<Button variant="text" color="primary" onClick={handleCloseDialog}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default BookDetails;

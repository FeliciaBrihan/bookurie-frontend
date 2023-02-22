import * as React from 'react';
import { forwardRef, useState } from 'react';

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
	TextField,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

import { TGetPermission, TSetPermission } from 'types/permission';
import { permissionApi } from 'store/slices/permission';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
	data: TGetPermission;
}

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

const PermissionEdit = ({ handleCloseDialog, data }: ProductAddProps) => {
	const defaultValue = {
		ActionId: data.ActionId,
		RoleId: data.RoleId,
	};
	const [formValue, setFormValue] = useState<TSetPermission>(defaultValue);

	const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormValue({
			...formValue,
			[event?.target.id]: event?.target.value,
		});
	};

	const handleUpdate = async () => {
		await permissionApi.update(
			data.id,
			{
				ActionId: formValue.ActionId,
				RoleId: formValue.RoleId,
			},
			{ sync: true }
		);
		handleCloseDialog();
	};

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
			<DialogTitle>Action #{data.id}</DialogTitle>
			<DialogContent>
				<Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
					<Grid item xs={12}>
						<TextField
							id="ActionId"
							required
							fullWidth
							defaultValue={formValue.ActionId}
							label="Enter Action Id"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="RoleId"
							required
							fullWidth
							defaultValue={formValue.RoleId}
							label="Enter Role Id"
							onChange={handleValueChange}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<AnimateButton>
					<Button variant="contained" onClick={handleUpdate}>
						Save
					</Button>
				</AnimateButton>
				<Button variant="text" color="error" onClick={handleCloseDialog}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PermissionEdit;

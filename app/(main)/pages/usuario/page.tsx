/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Login } from '@/types';
import { UserService } from '@/service/userService';


const CrudUser= () => {
    let emptyUser: Login.User = {
        id: 0,
        name: '',
        rg: '',
        email: '',
        password: ''
        
    };

    const [users, setUsers] = useState<Login.User[]>([]);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUSerDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState<Login.User>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<Login.User[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const userService = useMemo(() =>  new UserService(), []);


    useEffect(() => {
    if(users.length == 0) {

        userService.listarTodos()
            .then((response) => {
                console.log(response.data);
                setUsers(response.data); 
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }, [UserService, user]);



    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUSerDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };



    const saveUser = () => {
        setSubmitted(true);

       if (!user.id) {
    userService.inserir(user)
        .then((response) => {
            setUserDialog(false);
            setUser(emptyUser);
            setUsers([]);
            toast.current?.show({
                severity: 'info',
                summary: 'Sucesso',
                detail: 'Usuário Cadastrado com Sucesso',
            });
        })
        .catch((error) => {
            console.log(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao Salvar Usuário' + error.data.message,
            });
        });

        } else {
            userService.atualizar(user) 
            .then((response) => {
                setUserDialog(false);
                setUser(emptyUser);
                setUsers([]);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso',
                    detail: 'Usuário Alterado com Sucesso',
                });
            })

        }              
   };

    const editUser = (user: Login.User) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: Login.User) => {
        setUser(user);
        setDeleteUSerDialog(true);
    };

    const deleteUser = () => {

        if(user.id){

        userService.excluir(user.id)
            .then((response) => {
                setUser(emptyUser);
                setDeleteUSerDialog(false);
                setUsers([]);
                toast.current?.show({
                    severity:'success',
                    summary: 'Sucesso',
                    detail: 'Usuário Excluido com Sucesso',
                    life: 3000
                });

            }).catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao Excluir Usuário' + error.data.message,


                })
                
            });

        }
       
    };

    // const findIndexById = (id: string) => {
    //     let index = -1;
    //     for (let i = 0; i < (products as any)?.length; i++) {
    //         if ((products as any)[i].id === id) {
    //             index = i;
    //             break;
    //         }
    //     }

    //     return index;
    //};

    // const createId = () => {
    //     let id = '';
    //     let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (let i = 0; i < 5; i++) {
    //         id += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }
    //     return id;
    // };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const deleteSelectedUsers = () => {

        

        Promise.all(selectedUsers.map((_user) => {  
            
            if(_user.id){

            userService.excluir(_user.id)
            .then((response) => {
                
            }).catch((error) => {
                
                
            });

        }

    })).then((response) => {
        setUsers([]);
        setSelectedUsers([]);
        setDeleteUsersDialog(false);
        toast.current?.show({
            severity:'success',
            summary: 'Sucesso',
            detail: 'Usuário Excluidos com Sucesso!',
            life: 3000

     });
   
       
    }).catch((error) => {


    })

 

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;

        setUser(_user);
    };

    // const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
    //     const val = e.value || 0;
    //     let _product = { ...product };
    //     _product[`${name}`] = val;

    //     setProduct(_product);
    // };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !(selectedUsers as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Login.User) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Login.User) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.name}
            </>
        );
    };

    // const imageBodyTemplate = (rowData: Login.User) => {
    //      return (
    //         <>
    //             <span className="p-column-title">Foto</span>
    //             <img src={`/login.user/images/user/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
    //         </>
    //     );
    // };

    const rgBodyTemplate = (rowData: Login.User) => {
        return (
            <>
                <span className="p-column-title">Registro Geral</span>
                {rowData.rg}
            </>
        );
    };


    const emailBodyTemplate = (rowData: Login.User) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Login.User) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Usuários</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Pesquisar..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUser} />
        </>
    );
    const deleteUserDialogFooter = ( 
        <>
            <Button label="Nao" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="Nao" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUsers} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={users}
                        selection={selectedUsers}
                        onSelectionChange={(e) => setSelectedUsers(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} ate {last} de {totalRecords} usuários"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum usuário encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Codigo" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="rg" header="Registro Geral" sortable body={rgBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" body={emailBodyTemplate} sortable></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        
                    </DataTable>

                    <Dialog visible={userDialog} style={{ width: '450px' }} header="Detalhes de Usuários" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                       
                        <div className="field">
                            <label htmlFor="name">Nome</label>
                            <InputText
                                id="name"
                                value={user.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !user.name
                                })}
                            />
                            {submitted && !user.name && <small className="p-invalid">Nome e obrigatorio.</small>}
                        </div>

                        
                        <div className="field">
                           <label htmlFor="rg">Registro Geral</label>
                           <InputText
                               id="rg"
                               value={user.rg}
                               onChange={(e) => onInputChange(e, 'rg')}
                               required
                               autoFocus
                               className={classNames({
                                   'p-invalid': submitted && !user.name
                               })}
                           />
                           {submitted && !user.rg && <small className="p-invalid">RG e obrigatorio.</small>}
                       </div>

                        
                        <div className="field">
                           <label htmlFor="email">Email</label>
                           <InputText
                               id="email"
                               value={user.email}
                               onChange={(e) => onInputChange(e, 'email')}
                               required
                               autoFocus
                               className={classNames({
                                   'p-invalid': submitted && !user.name
                               })}
                           />
                           {submitted && !user.email && <small className="p-invalid">Email e obrigatorio.</small>}
                       </div>

                       <div className="field">
                           <label htmlFor="password">Senha</label>
                           <InputText
                               id="password"
                               value={user.password}
                               onChange={(e) => onInputChange(e, 'password')}
                               required
                               autoFocus
                               className={classNames({
                                   'p-invalid': submitted && !user.name
                               })}
                           />
                           {submitted && !user.password && <small className="p-invalid">Senha e obrigatorio.</small>}
                       </div>
                                      

                    </Dialog>

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                   Voce realemte deseja excluir o usuário <b>{user.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Voce realmente deseja excluir os usuários selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CrudUser;

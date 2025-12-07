"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { Button } from '@/shared/ui/buttons/button';
import { Badge } from '@/shared/ui/badges/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/shared/ui/tables/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/shared/ui/misc/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/shared/ui/misc/alert-dialog';
import { Users, Plus, MoreHorizontal, Pencil, Trash2, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useUsers } from '@/features/auth/presentation/hooks/use-users';
import { UserFormModal, type UserFormData } from '@/features/auth/presentation/components/user-form-modal';
import { useAuth, type User, type RoleId, isAdmin } from '@/features/auth';

const ROLE_COLORS: Record<RoleId, string> = {
  super_admin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  coordinator: 'bg-green-100 text-green-800',
  operator: 'bg-yellow-100 text-yellow-800',
  visitor: 'bg-gray-100 text-gray-800',
  public: 'bg-gray-50 text-gray-600',
};

export default function UsersAdminPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const { users, isLoading, error, fetchUsers, createUser, updateUser, deleteUser, clearError } = useUsers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    if (currentUser && isAdmin(currentUser)) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  // Get allowed roles based on current user
  const getAllowedRoles = (): RoleId[] => {
    if (!currentUser) return [];

    const hierarchy: RoleId[] = ['visitor', 'operator', 'coordinator', 'admin', 'super_admin'];
    const currentIndex = hierarchy.indexOf(currentUser.role.id);

    return hierarchy.slice(0, currentIndex + 1);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setDeletingUser(user);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleSubmitForm = async (data: UserFormData) => {
    setIsSubmitting(true);

    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          username: data.username,
          email: data.email,
          password: data.password || undefined,
          roleId: data.roleId,
        });
      } else {
        await createUser({
          username: data.username,
          email: data.email,
          password: data.password,
          roleId: data.roleId,
          sendConfirmationEmail: data.sendConfirmationEmail,
        });
      }
      handleCloseForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    setIsSubmitting(true);
    try {
      await deleteUser(deletingUser.id);
    } finally {
      setIsSubmitting(false);
      setDeletingUser(null);
    }
  };

  // Check permission
  if (!authLoading && (!currentUser || !isAdmin(currentUser))) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground">
              No tienes permisos para acceder a esta sección.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios y sus permisos en el sistema
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-800">{error}</p>
            <Button variant="ghost" size="sm" onClick={clearError} className="ml-auto">
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay usuarios registrados</p>
              <Button variant="outline" onClick={handleOpenCreate} className="mt-4">
                Crear el primer usuario
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[70px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={ROLE_COLORS[user.role.id] || ROLE_COLORS.visitor}>
                        {user.role.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          Inactivo
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        user={editingUser}
        isLoading={isSubmitting}
        allowedRoles={getAllowedRoles()}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente a{' '}
              <strong>{deletingUser?.name}</strong> del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

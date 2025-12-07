"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/misc/dialog';
import { Button } from '@/shared/ui/buttons/button';
import { Input } from '@/shared/ui/inputs/input';
import { Label } from '@/shared/ui/labels/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/inputs/select';
import { Checkbox } from '@/shared/ui/inputs/checkbox';
import { Loader2 } from 'lucide-react';
import { ROLES, type RoleCode, type User } from '@/features/auth';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserFormData) => Promise<void>;
    user?: User | null;
    isLoading?: boolean;
    allowedRoles?: RoleCode[];
}

export interface UserFormData {
    username: string;
    email: string;
    password: string;
    roleCode: RoleCode;
    sendConfirmationEmail: boolean;
}

const DEFAULT_ROLES: RoleCode[] = ['guest', 'admin'];

export function UserFormModal({
    isOpen,
    onClose,
    onSubmit,
    user,
    isLoading = false,
    allowedRoles = DEFAULT_ROLES,
}: UserFormModalProps) {
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        email: '',
        password: '',
        roleCode: 'guest',
        sendConfirmationEmail: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = !!user;

    // Reset form when dialog opens/user changes
    useEffect(() => {
        if (isOpen) {
            if (user) {
                setFormData({
                    username: user.name,
                    email: user.email,
                    password: '',
                    roleCode: user.role.code,
                    sendConfirmationEmail: false,
                });
            } else {
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    roleCode: 'guest',
                    sendConfirmationEmail: false,
                });
            }
            setErrors({});
        }
    }, [isOpen, user]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!isEdit && !formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        await onSubmit(formData);
    };

    const handleChange = (field: keyof UserFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Editar Usuario' : 'Crear Usuario'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Nombre de usuario</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            placeholder="usuario123"
                            disabled={isLoading}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">{errors.username}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="usuario@ejemplo.com"
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Contraseña {isEdit && '(dejar vacío para mantener)'}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select
                            value={formData.roleCode}
                            onValueChange={(value) => handleChange('roleCode', value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {allowedRoles.map((roleId) => (
                                    <SelectItem key={roleId} value={roleId}>
                                        {ROLES[roleId].name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {!isEdit && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="sendEmail"
                                checked={formData.sendConfirmationEmail}
                                onCheckedChange={(checked) =>
                                    handleChange('sendConfirmationEmail', checked === true)
                                }
                                disabled={isLoading}
                            />
                            <Label htmlFor="sendEmail" className="text-sm font-normal">
                                Enviar email de confirmación
                            </Label>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Guardar' : 'Crear'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

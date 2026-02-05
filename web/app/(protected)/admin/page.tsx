import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { 
  Package, 
  Users, 
  Activity, 
  FileText, 
  Wrench,
  Clock,
  CloudUpload,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileIcon,
  PrinterIcon,
  UserCircle,
  UserPlus,
  Play
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getDashboardMetrics, getActiveProjects, getActiveSpecialists, getRecentActivity, type RecentActivityItem } from "./actions";

// Formateador de bytes a formato legible
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default async function AdminDashboardPage() {
  // Obtener métricas reales de la base de datos
  const metrics = await getDashboardMetrics();
  const activeProjectsList = await getActiveProjects();
  const activeSpecialistsList = await getActiveSpecialists();
  const recentActivities = await getRecentActivity();

  // Calcular porcentajes
  const equipmentUsagePercent = metrics.totalEquipment > 0 
    ? Math.round((metrics.equipmentInUse / metrics.totalEquipment) * 100) 
    : 0;

  const storageUsagePercent = metrics.storageTotal > 0
    ? Math.round((metrics.storageUsed / metrics.storageTotal) * 100)
    : 0;

  // Función para obtener el ícono según el tipo de actividad
  function getActivityIcon(activity: RecentActivityItem) {
    switch (activity.type) {
      case "equipment_usage":
        return activity.metadata?.isActive ? Play : PrinterIcon;
      case "new_member":
        return UserPlus;
      case "project":
        return FileIcon;
      default:
        return Activity;
    }
  }

  // Función para obtener el color según el tipo de actividad
  function getActivityColor(activity: RecentActivityItem) {
    switch (activity.type) {
      case "equipment_usage":
        return activity.metadata?.isActive 
          ? "bg-green-100 text-green-600" 
          : "bg-purple-100 text-purple-600";
      case "new_member":
        return "bg-blue-100 text-blue-600";
      case "project":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-600 font-medium hidden sm:inline">Sistema Operativo</span>
          <span className="text-green-600 font-medium sm:hidden">Online</span>
        </div>
      </div>

      {/* Stats Grid - 3 columns on mobile */}
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4">
        {/* Proyectos Activos */}
        <Card className="aspect-square sm:aspect-auto">
          <CardHeader className="p-2 sm:pb-2 sm:p-6">
            <CardTitle className="text-[8px] sm:text-sm font-medium text-gray-600 leading-tight">Proyectos</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-3xl font-bold mb-0 sm:mb-1">{metrics.activeProjects}</div>
            <div className="hidden sm:flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{metrics.projectsTrend}% vs. mes anterior
            </div>
          </CardContent>
        </Card>

        {/* Equipos en Inventario */}
        <Card className="aspect-square sm:aspect-auto">
          <CardHeader className="p-2 sm:pb-2 sm:p-6">
            <CardTitle className="text-[8px] sm:text-sm font-medium text-gray-600 leading-tight">Equipos</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-3xl font-bold mb-0 sm:mb-1">
              {metrics.totalEquipment}
            </div>
            <div className="hidden sm:flex items-center text-xs text-blue-600">
              <Package className="h-3 w-3 mr-1" />
              {metrics.totalStock.toLocaleString()} unidades en stock
            </div>
          </CardContent>
        </Card>

        {/* Items Bajo Stock */}
        <Card className="aspect-square sm:aspect-auto">
          <CardHeader className="p-2 sm:pb-2 sm:p-6">
            <CardTitle className="text-[8px] sm:text-sm font-medium text-gray-600 leading-tight">Bajo Stock</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-3xl font-bold mb-0 sm:mb-1">{metrics.lowStockItems}</div>
            <div className="hidden sm:flex items-center text-xs text-orange-600">
              {metrics.lowStockItems > 0 ? (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Requiere atención
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Stock adecuado
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Especialistas Activos */}
        <Card className="aspect-square sm:aspect-auto" className="aspect-square sm:aspect-auto">
          <CardHeader className="p-2 sm:pb-2 sm:p-6">
            <CardTitle className="text-[8px] sm:text-sm font-medium text-gray-600 leading-tight">Equipo</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-3xl font-bold mb-0 sm:mb-1">
              {metrics.activeSpecialists}/{metrics.totalSpecialists}
            </div>
            <div className="hidden sm:flex items-center text-xs text-green-600">
              {metrics.teamImprovement > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{metrics.teamImprovement}% mejora del equipo
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Equipo completo
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Almacenamiento en Nube */}
        <Card className="aspect-square sm:aspect-auto">
          <CardHeader className="p-2 sm:pb-2 sm:p-6">
            <CardTitle className="text-[8px] sm:text-sm font-medium text-gray-600 leading-tight">Archivos</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-3xl font-bold mb-0 sm:mb-1">{metrics.storageFiles}</div>
            <div className="hidden sm:block w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  storageUsagePercent > 90 ? 'bg-red-500' : 
                  storageUsagePercent > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${storageUsagePercent}%` }}
              ></div>
            </div>
            <div className="hidden sm:flex items-center text-xs text-blue-600 mt-1">
              <CloudUpload className="h-3 w-3 mr-1" />
              {formatBytes(metrics.storageUsed)} de {formatBytes(metrics.storageTotal)}
            </div>
          </CardContent>
        </Card>

        {/* Actividad del Mes */}
        <Card className="aspect-square sm:aspect-auto">
          <CardHeader className="p-2 sm:pb-2 sm:p-6">
            <CardTitle className="text-[8px] sm:text-sm font-medium text-gray-600 leading-tight">Actividad</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-3xl font-bold mb-0 sm:mb-1">
              {metrics.activeProjects + metrics.activeSpecialists}
            </div>
            <div className="hidden sm:flex items-center text-xs text-green-600">
              <Activity className="h-3 w-3 mr-1" />
              Proyectos + Especialistas activos
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proyectos Activos List */}
      {activeProjectsList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Proyectos en Curso</CardTitle>
            <p className="text-sm text-gray-500">Proyectos actualmente activos</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeProjectsList.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{project.title}</p>
                      {project.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">{project.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    Activo
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Especialistas Activos List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Especialistas en el Equipo</CardTitle>
            <p className="text-sm text-gray-500">Miembros visibles en /equipo</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/content/team">
              <Users className="h-4 w-4 mr-2" />
              Gestionar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {activeSpecialistsList.length === 0 ? (
            <div className="text-center py-8">
              <UserCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay especialistas activos</p>
              <p className="text-gray-400 text-xs mt-1">Agrega miembros desde la sección de Equipo</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/admin/content/team">
                  Agregar especialista
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {activeSpecialistsList.slice(0, 6).map((specialist) => (
                <div key={specialist.id} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  {specialist.image ? (
                    <Image
                      src={specialist.image}
                      alt={specialist.name || 'Especialista'}
                      width={64}
                      height={64}
                      className="w-16 h-16 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm sm:text-sm flex-shrink-0">
                      {specialist.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                    </div>
                  )}
                  <div className="w-full min-w-0 text-center sm:text-left">
                    <p className="font-medium text-xs sm:text-sm truncate px-1">{specialist.name}</p>
                    <p className="hidden sm:block text-xs text-gray-500 truncate">{specialist.role || specialist.specialty || 'Especialista'}</p>
                  </div>
                  <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    specialist.category === 'leadership' 
                      ? 'bg-purple-100 text-purple-700'
                      : specialist.category === 'specialist'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {specialist.category === 'leadership' ? 'Directivo' : 
                     specialist.category === 'specialist' ? 'Especialista' : 'Colaborador'}
                  </span>
                </div>
              ))}
            </div>
          )}
          {activeSpecialistsList.length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/content/team">
                  Ver todos ({activeSpecialistsList.length})
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Actividad Reciente</CardTitle>
            <p className="text-sm text-gray-500">Últimas acciones en el sistema</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/equipment-usage">
              <Clock className="h-4 w-4 mr-2" />
              Ver todo
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay actividad reciente</p>
              <p className="text-gray-400 text-xs mt-1">Las acciones del sistema aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity);
                const activityColor = getActivityColor(activity);
                
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    {/* Avatar del usuario o ícono */}
                    <div className="relative">
                      {activity.userAvatar ? (
                        <Image
                          src={activity.userAvatar}
                          alt={activity.user}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                          {activity.user?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                        </div>
                      )}
                      {/* Badge de tipo de actividad */}
                      <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${activityColor}`}>
                        <ActivityIcon className="h-3 w-3" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">{activity.user}</p>
                        {activity.metadata?.isActive && activity.metadata?.duration && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                            {activity.metadata.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Acciones Rápidas</CardTitle>
          <p className="text-sm text-gray-500">Accesos directos a funciones comunes</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <Link href="/admin/content/projects">
                <FileText className="h-4 w-4 mr-2" />
                Ver Proyectos
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <Link href="/admin/inventory/items">
                <Wrench className="h-4 w-4 mr-2" />
                Ver Equipos
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <Link href="/admin/content/team">
                <Users className="h-4 w-4 mr-2" />
                Ver Especialistas
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <Link href="/admin/inventory">
                <Package className="h-4 w-4 mr-2" />
                Ver Inventario
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

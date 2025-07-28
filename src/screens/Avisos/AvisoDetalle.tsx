import React, { useEffect, useRef, useState } from 'react';

// Formatea fecha a dd/MM/yyyy HH:mm
const formatFecha = (fechaStr: string): string => {
  const d = new Date(fechaStr);
  if (isNaN(d.getTime())) return fechaStr;
  const pad = (n: number) => (n < 10 ? `0${n}` : n);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
import { useSession } from '../../context/SessionContext';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MainLayout from '../../components/MainLayout';
import { Avatar } from '../../components/Avatar';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { theme } from '../../styles/theme';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { StorageManager } from '../../utils/storage';


const AvisoDetalle = ({ route, navigation }: any) => {
  const { aviso } = route.params;
  console.log('[AvisoDetalle] aviso recibido:', aviso);
  const panRef = useRef(null);

  // Handler for swipe-back gesture
  const onPanGestureEvent = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      // Swipe right to go back
      if (event.nativeEvent.translationX > 60) {
        navigation.goBack();
      }
    }
  };
  const [expediente, setExpediente] = useState<any>(null);
  const [loadingExpediente, setLoadingExpediente] = useState(false);
  const [errorExpediente, setErrorExpediente] = useState<string | null>(null);
  const { token } = useSession();

  const pad = (n: number) => (n < 10 ? `0${n}` : n);
  let fechaCorta = '';
  // Soporta tanto 'fecha' como 'Fecha' (mayúscula)
  const rawFecha = aviso?.fecha || aviso?.Fecha;
  if (rawFecha) {
    const d = new Date(rawFecha);
    if (!isNaN(d.getTime())) {
      const yearShort = d.getFullYear().toString().slice(-2);
      fechaCorta = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${yearShort} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } else {
      fechaCorta = rawFecha;
    }
  } else {
    fechaCorta = '-';
  }

  useEffect(() => {
    const fetchExpediente = async () => {
      setLoadingExpediente(true);
      setErrorExpediente(null);
      try {
        if (!token) throw new Error('Token no disponible');
        if (!aviso?.idRegistro) throw new Error('ID de registro no disponible');
        const config = await StorageManager.getAppConfig();
        if (!config || !(config as any).UrlSwagger) throw new Error('No se encontró la URL base en la configuración');
        let baseUrl = (config as any).UrlSwagger;
        if (!baseUrl.endsWith('/')) baseUrl += '/';
        const url = `${baseUrl}registros/getRegistroById`;
        const bodyRegistros = {
          token,
          id: aviso.idRegistro
        };
        console.log('[fetchExpediente] URL:', url);
        console.log('[fetchExpediente] Body:', bodyRegistros);
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyRegistros)
        });
        console.log('[fetchExpediente] Status:', response.status);
        let data = null;
        try {
          data = await response.json();
        } catch (jsonErr) {
          console.log('[fetchExpediente] Error parsing JSON:', jsonErr);
        }
        console.log('[fetchExpediente] Data:', data);
        if (!response.ok || !data) throw new Error('Error al obtener expediente');
        if (data.error || data.message) {
          throw new Error(data.error || data.message);
        }
        setExpediente(data);
      } catch (err: any) {
        console.log('[fetchExpediente] Error:', err);
        setErrorExpediente(err.message || 'Error desconocido');
        setExpediente(null);
      } finally {
        setLoadingExpediente(false);
      }
    };
    fetchExpediente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, aviso?.idRegistro]);

  return (
    <MainLayout
      title="Detalle del Aviso"
      navbarBgColor={theme.colors.primary.main}
      navbarTextColor="#fff"
      bottomNav={
        <View style={styles.bottomNav}>
          {[
            { name: 'Eliminar', icon: 'delete-outline', label: 'Eliminar' },
            { name: 'Mail', icon: 'mail-outline', label: 'Mail' },
            { name: 'Destacar', icon: 'star-outline', label: 'Destacar' },
            { name: 'Responder', icon: 'reply', label: 'Responder' },
            { name: 'Reenviar', icon: 'forward-to-inbox', label: 'Reenviar' },
          ].map((tab, i) => (
            <TouchableOpacity
              key={i}
              style={styles.navItem}
            >
              <MaterialIcons
                name={tab.icon}
                size={28}
                color={theme.colors.primary.main}
                style={styles.navIcon}
              />
              <Typography style={styles.navText}>
                {tab.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      }
    >
      <View style={{flex: 1}}>
        <PanGestureHandler
          ref={panRef}
          onHandlerStateChange={onPanGestureEvent}
          activeOffsetX={20}
        >
          <ScrollView contentContainerStyle={{alignItems: 'center', paddingBottom: 32, flexGrow: 1, width: '100%'}} showsVerticalScrollIndicator={false}>
            {/* Card superior para prioridad y fecha */}
            <View style={styles.infoCardTop}>
              <View style={styles.infoCardRow}>
                {typeof aviso?.prioridad === 'number' &&
                  aviso.prioridad >= 0 &&
                  aviso.prioridad <= 4 && (
                    <View style={styles.prioridadBadge}>
                      <Typography style={styles.prioridadBadgeText}>
                        {['Muy Baja', 'Baja', 'Media', 'Alta', 'Muy Alta'][aviso.prioridad]}
                      </Typography>
                    </View>
                  )}
                <View style={styles.flex1} />
                <Typography style={styles.mailDateText}>{fechaCorta || 'Sin fecha'}</Typography>
              </View>
            </View>
            {/* Card principal para remitente, puesto y asunto */}
            <View style={styles.mailCard}>
              <View style={styles.mailHeaderRow}>
                <View style={styles.rowAlignCenterFlex1}>
                  <Avatar src={aviso?.ImgUsuario} size={44} style={styles.avatarMargin} />
                  <View style={styles.flex1}>
                    <Typography style={styles.mailSenderText}>
                      Aviso enviado por: {aviso?.nombreUsuario || 'Sin usuario'}
                    </Typography>
                    <Typography style={styles.mailJobText}>
                      {aviso?.puestoTrabajo || aviso?.puesto || 'Sin puesto'}
                    </Typography>
                  </View>
                </View>
              </View>
              <View style={styles.mailSubjectRow}>
                <Typography style={styles.mailSubjectText}>
                  {aviso?.asunto || aviso?.comentario || 'Sin asunto'}
                </Typography>
              </View>
            </View>
            {/* Card para información de expediente */}
            <View style={styles.mailCard}>
              {loadingExpediente ? (
                <Typography style={styles.extraInfoValue}>Cargando expediente...</Typography>
              ) : errorExpediente ? (
                <Typography style={styles.extraInfoValue}>Error: {errorExpediente}</Typography>
              ) : expediente && expediente.registro && expediente.registro.TipoEntr === "0" ? (
                <View>
                  <Typography style={styles.infoRegistroTitle}>Información del Registro</Typography>
                  <View style={styles.infoRegistroGrid}>
                    <View style={styles.infoRegistroColLeft}>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Registro:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.NTipoReg || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Fecha:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Fecha ? formatFecha(expediente.registro.Fecha) : '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Estado:</Typography><Typography style={styles.estadoBadge}>{expediente.registro.Estado || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Interesado:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.DniInteresado ? `${expediente.registro.DniInteresado} - ${expediente.registro.NInteresado}` : expediente.registro.NInteresado || '-'}</Typography></View>
                    </View>
                    <View style={styles.infoRegistroColRight}>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Referencia:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Referencia || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Referencia2:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Referencia2 || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Extracto:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Extracto || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Serie:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Serie || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Tipo Documentación:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.NTipoDocumento || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Forma de entrega:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.FormaEntrega || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Dirigido A:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.DirigidoA || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Etiquetas:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Etiquetas || '-'}</Typography></View>
                    </View>
                  </View>
                </View>
              ) : expediente && expediente.registro && expediente.registro.TipoEntr === "2" ? (
                <View>
                  <Typography style={styles.infoRegistroTitle}>
                    Información del Expediente - {expediente.registro.Numero || '-'} / {expediente.registro.Anio || '-'} : {expediente.registro.Referencia || ''}
                  </Typography>
                  <View style={styles.infoRegistroGrid}>
                    <View style={styles.infoRegistroColLeft}>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Registro:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.NTipoReg || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Materia:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Materia || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Fecha registro:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Fecha ? formatFecha(expediente.registro.Fecha) : '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Estado:</Typography><Typography style={styles.estadoBadge}>{expediente.registro.Estado || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Etiquetas:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Etiquetas || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Instructor:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Instructor || '-'}</Typography></View>
                    </View>
                    <View style={styles.infoRegistroColRight}>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Serie:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Serie || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Interesado:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Interesado || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Solicitante:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Solicitante || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Referencia2:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Referencia2 || '-'}</Typography></View>
                      <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Extracto:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Extracto || '-'}</Typography></View>
                    </View>
                  </View>
                </View>
              ) : expediente && expediente.registro ? (
                <View>
                  <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Registro:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Numero || aviso?.idRegistro || '-'}</Typography></View>
                  <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Materia:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Materia || '-'}</Typography></View>
                  <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Estado:</Typography><Typography style={styles.extraInfoEstado}>{expediente.registro.Estado || '-'}</Typography></View>
                  <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Etiquetas:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Etiquetas || '-'}</Typography></View>
                  <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Interesado:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Interesado || '-'}</Typography></View>
                  <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Solicitante:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Solicitante || '-'}</Typography></View>
                  <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Referencia:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Referencia2 || '-'}</Typography></View>
                  <View style={styles.extraInfoRow}><Typography style={styles.extraInfoLabel}>Extracto:</Typography><Typography style={styles.extraInfoValue}>{expediente.registro.Extracto || '-'}</Typography></View>
                </View>
              ) : (
                <Typography style={styles.extraInfoValue}>Sin datos de expediente</Typography>
              )}
              {/* Metadatos del expediente */}
              {expediente && Array.isArray(expediente.Metadata) && expediente.Metadata.length > 0 && (
                <View style={{ marginTop: 16 }}>
                  <Typography style={styles.extraInfoTitle}>Metadatos</Typography>
                  {expediente.Metadata.map((meta, idx) => (
                    <View style={styles.extraInfoRow} key={meta.Id || idx}>
                      <Typography style={styles.extraInfoLabel}>{meta.Descripcion || meta.Nombre}:</Typography>
                      <Typography style={styles.extraInfoValue}>{meta.Valor || '-'}</Typography>
                    </View>
                  ))}
                </View>
              )}
              {/* Documentos adjuntos */}
              {expediente && Array.isArray(expediente.Documents) && expediente.Documents.length > 0 && (
                <View style={{ marginTop: 16 }}>
                  <Typography style={styles.extraInfoTitle}>Documentos adjuntos</Typography>
                  {expediente.Documents.map((doc, idx) => (
                    <View style={styles.extraInfoRow} key={doc.Id || idx}>
                      <Typography style={styles.extraInfoValue}>{doc.Descripcion || 'Documento sin nombre'}</Typography>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </PanGestureHandler>
      </View>
    </MainLayout>
  );
// ...existing code up to the end of the return in AvisoDetalle...
};



const styles = StyleSheet.create({
  infoRegistroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 10,
  },
  infoRegistroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 8,
  },
  infoRegistroColLeft: {
    flex: 1,
    minWidth: 220,
    marginRight: 24,
  },
  infoRegistroColRight: {
    flex: 1,
    minWidth: 220,
  },
  estadoBadge: {
    backgroundColor: '#ffe600',
    color: '#444',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontWeight: '700',
    fontSize: 12,
    overflow: 'hidden',
    marginLeft: 4,
    minWidth: 70,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  prioridadBadge: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
    paddingHorizontal: 65,
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary.dark,
  },
  prioridadBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 10,
    textAlign: 'center',
  },
  infoCardTop: {
    backgroundColor: '#fff',
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 0,
    padding: 18,
    width: 'auto',
    maxWidth: 900,
    alignSelf: 'center',
    boxSizing: 'border-box',
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  extraInfoContainerFull: {
    marginTop: 16,
    backgroundColor: '#f8f8fa',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    boxSizing: 'border-box',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
  },
  navIcon: {
    marginBottom: 2,
  },
  navIconActive: {
    marginBottom: 2,
  },
  navText: {
    fontSize: 10,
    color: theme.colors.primary.main,
  },
  navTextActive: {
    fontSize: 10,
    color: '#FFF',
  },
  flex1: {
    flex: 1,
  },
  avatarMargin: { marginRight: 8 },
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mailCard: {
    minHeight: 160,
    backgroundColor: '#fff',
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 0,
    padding: 18,
    minWidth: 320,
    maxWidth: 600,
    width: '90%',
    alignSelf: 'center',
  },
  mailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
    gap: 8,
  },
  rowAlignCenterFlex1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mailSenderText: {
    fontSize: 13,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  mailJobText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '400',
  },
  mailSubjectRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mailSubjectText: {
    fontSize: 15,
    color: theme.colors.text.primary,
    fontWeight: '500',
    lineHeight: 22,
  },
  mailActionsRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
    gap: 4,
  },
  mailPrioridadText: {
    fontSize: 12,
    color: '#222',
    fontWeight: '700',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 80,
    textAlign: 'left',
  },
  mailDateText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '400',
    textAlign: 'right',
    minWidth: 120,
  },
  extraInfoContainer: {
    marginTop: 8,
    backgroundColor: '#f8f8fa',
    borderRadius: 12,
    padding: 10,
  },
  extraInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: 6,
  },
  extraInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  extraInfoLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    minWidth: 90,
  },
  extraInfoValue: {
    fontSize: 12,
    color: theme.colors.text.primary,
    fontWeight: '400',
    flex: 1,
  },
  extraInfoEstado: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#ffe600',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontWeight: '700',
  },
});
export default AvisoDetalle;

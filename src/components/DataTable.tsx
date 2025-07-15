import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { Card } from './Card';
import { Chip } from './Chip';
import { Checkbox } from './Checkbox';
import { theme } from '../styles/theme';

interface Column {
  key: string;
  title: string;
  width?: number;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onRowPress?: (row: any) => void;
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
  style?: ViewStyle;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  onRowPress,
  searchable = false,
  sortable = false,
  selectable = false,
  onSelectionChange,
  style,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());

  const filteredData = useMemo(() => {
    let filtered = data;

    // Search filter
    if (searchable && searchQuery) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    if (sortable && sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchQuery, sortConfig, searchable, sortable]);

  const handleSort = (key: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowSelection = (row: any) => {
    if (!selectable) return;

    const newSelection = new Set(selectedRows);
    if (newSelection.has(row)) {
      newSelection.delete(row);
    } else {
      newSelection.add(row);
    }
    
    setSelectedRows(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const newSelection = new Set(filteredData);
      setSelectedRows(newSelection);
      onSelectionChange?.(filteredData);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {selectable && (
        <View style={[styles.headerCell, styles.checkboxCell]}>
          <Checkbox
            value={selectedRows.size === filteredData.length && filteredData.length > 0}
            onValueChange={handleSelectAll}
            color="primary"
          />
        </View>
      )}
      {columns.map((column) => (
        <TouchableOpacity
          key={column.key}
          style={[
            styles.headerCell,
            column.width && { width: column.width },
            column.sortable && styles.sortableHeader,
          ]}
          onPress={() => handleSort(column.key)}
          disabled={!column.sortable}
        >
          <Typography
            variant="body2"
            style={[
              styles.headerText,
              sortConfig?.key === column.key && styles.sortedHeaderText,
            ]}
          >
            {column.title}
          </Typography>
          {sortConfig?.key === column.key && (
            <Typography style={styles.sortIcon}>
              {sortConfig.direction === 'asc' ? '↑' : '↓'}
            </Typography>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRow = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={[
        styles.dataRow,
        index % 2 === 0 && styles.evenRow,
        selectedRows.has(item) && styles.selectedRow,
      ]}
      onPress={() => onRowPress?.(item)}
    >
      {selectable && (
        <View style={[styles.dataCell, styles.checkboxCell]}>
          <Checkbox
            value={selectedRows.has(item)}
            onValueChange={() => handleRowSelection(item)}
            color="primary"
          />
        </View>
      )}
      {columns.map((column) => (
        <View
          key={column.key}
          style={[
            styles.dataCell,
            column.width && { width: column.width },
          ]}
        >
          {column.render ? (
            column.render(item[column.key], item)
          ) : (
            <Typography variant="body2" style={styles.cellText}>
              {typeof item[column.key] === 'boolean' ? (
                <Chip
                  label={item[column.key] ? 'Activo' : 'Inactivo'}
                  color={item[column.key] ? 'success' : 'error'}
                  size="small"
                />
              ) : (
                String(item[column.key] || '')
              )}
            </Typography>
          )}
        </View>
      ))}
    </TouchableOpacity>
  );

  return (
    <Card style={[styles.container, style]}>
      {searchable && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>
      )}
      
      <View style={styles.tableContainer}>
        {renderHeader()}
        <FlatList
          data={filteredData}
          renderItem={renderRow}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography variant="body2" style={styles.emptyText}>
                No hay datos disponibles
              </Typography>
            </View>
          }
        />
      </View>
      
      {selectable && selectedRows.size > 0 && (
        <View style={styles.selectionInfo}>
          <Typography variant="caption" style={styles.selectionText}>
            {selectedRows.size} elemento(s) seleccionado(s)
          </Typography>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    overflow: 'hidden',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  searchInput: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  tableContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.grey[50],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  checkboxCell: {
    flex: 0,
    width: 48,
    justifyContent: 'center',
  },
  sortableHeader: {
    opacity: 0.8,
  },
  headerText: {
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  sortedHeaderText: {
    color: theme.colors.primary.main,
  },
  sortIcon: {
    color: theme.colors.primary.main,
    fontSize: 12,
    marginLeft: 4,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  evenRow: {
    backgroundColor: theme.colors.grey[25],
  },
  selectedRow: {
    backgroundColor: theme.colors.primary.lightOpacity,
  },
  dataCell: {
    flex: 1,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  cellText: {
    color: theme.colors.text.primary,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.text.secondary,
  },
  selectionInfo: {
    padding: 12,
    backgroundColor: theme.colors.primary.lightOpacity,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  selectionText: {
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
});

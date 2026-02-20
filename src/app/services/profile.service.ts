import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  getRawProfileFromStorage(): any {
    const data = localStorage.getItem('profileData');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse profileData from localStorage:', e);
      return null;
    }
  }

  normalizeProfileData(profileData: any): any {
    if (!profileData) return null;

    const normalized: any = {};

    Object.entries(profileData).forEach(([key, value]: [string, any]) => {
      if (value && typeof value === 'object' && 'id' in value) {
        normalized[key] = value.id;
      } else {
        normalized[key] = value;
      }
    });

    return normalized;
  }

  normalizeRole(role: string): string {
  if (!role) return '';

  return role
    .split(',')
    .map(r => r.trim().toLowerCase())
    .sort()
    .join(',');
}

buildProfileInfo(
  profileData: any,
  orderedKeys: string[] = ['block', 'school', 'cluster'],
  excludeKeys: string[] = ['state', 'district']
): string {

  if (!profileData) return '';

  const values: string[] = [];

  orderedKeys.forEach(key => {
    if (profileData[key]?.name) {
      values.push(profileData[key].name);
    }
  });

  Object.entries(profileData).forEach(([key, value]: [string, any]) => {
    if (
      !orderedKeys.includes(key) &&
      !excludeKeys.includes(key) &&
      value?.name
    ) {
      values.push(value.name);
    }
  });

  return values.join(', ');
}

hasMissingFields(profileData: any, requiredFields: string[]): boolean {
  return requiredFields?.some(field => !profileData?.[field]);
}
}

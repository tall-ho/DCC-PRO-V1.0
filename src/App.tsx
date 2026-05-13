/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VisibilityProvider } from './context/ModuleVisibilityContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import UserPermissions from './pages/UserPermissions';
import AccessLogs from './pages/AccessLogs';

import CarLog from './pages/Audit/CaRequest/Log';
import Pending from './pages/Audit/CaRequest/Pending';
import QualifiedAuditors from './pages/Audit/Auditor/QualifiedAuditors';
import ExternalDocuments from './pages/MasterList/ExternalDocuments';
import DistributionLog from './pages/DocumentDistribution/Log';
import DocumentList from './pages/MasterList/DocumentList';
import DarPending from './pages/DocumentRequest/Pending';

export default function App() {
  return (
    <AuthProvider>
      <VisibilityProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            {/* Protected Routes */}
            <Route element={<Layout />}>
              {/* General Modules (Read-only by default) */}
              <Route path="/employees" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Employees Directory" />
                </ProtectedRoute>
              } />
              <Route path="/recruitment" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Recruitment" />
                </ProtectedRoute>
              } />
              <Route path="/attendance" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Attendance Core" />
                </ProtectedRoute>
              } />
              <Route path="/leave" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Leave Requests" />
                </ProtectedRoute>
              } />
              <Route path="/payroll" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Payroll" />
                </ProtectedRoute>
              } />
              <Route path="/appraisals" element={
                <ProtectedRoute>
                  <PlaceholderPage title="Appraisals" />
                </ProtectedRoute>
              } />

              {/* Confidential Modules */}
              <Route path="/audit/ca-request/log" element={
                <ProtectedRoute>
                  <CarLog />
                </ProtectedRoute>
              } />
              <Route path="/audit/ca-request/pending" element={
                <ProtectedRoute>
                  <Pending />
                </ProtectedRoute>
              } />
              <Route path="/docs/master-list/external" element={
                <ProtectedRoute>
                  <ExternalDocuments />
                </ProtectedRoute>
              } />
              <Route path="/docs/master-list/documents" element={
                <ProtectedRoute>
                  <DocumentList />
                </ProtectedRoute>
              } />
              <Route path="/docs/distribution/log" element={
                <ProtectedRoute>
                  <DistributionLog />
                </ProtectedRoute>
              } />
              <Route path="/docs/requests/pending" element={
                <ProtectedRoute>
                  <DarPending />
                </ProtectedRoute>
              } />
              <Route path="/audit/auditor/qualified" element={
                <ProtectedRoute>
                  <QualifiedAuditors />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute isConfidential>
                  <PlaceholderPage title="HR Settings" />
                </ProtectedRoute>
              } />
              <Route path="/permissions" element={
                <ProtectedRoute isConfidential>
                  <UserPermissions />
                </ProtectedRoute>
              } />
              <Route path="/access-logs" element={
                <ProtectedRoute isConfidential>
                  <AccessLogs />
                </ProtectedRoute>
              } />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </VisibilityProvider>
    </AuthProvider>
  );
}


import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResponsive, useAppHeight } from '@shared/hooks'
import Header from '@components/main/Header'
import MobileHeader from '@components/mobile/MobileHeader'
import MobileFooter from '@components/mobile/MobileFooter'
import AdminSidebar from '@components/admin/AdminSidebar'
import AdminDashboard from '@components/admin/AdminDashboard'
import UserManagement from '@components/admin/UserManagement'
import ChallengeManagement from '@components/admin/ChallengeManagement'
import PostModeration from '@components/admin/PostModeration'
import CommentModeration from '@components/admin/CommentModeration'
import StatisticsPanel from '@components/admin/StatisticsPanel'
import TeamsManagement from '@components/admin/TeamsManagement'
import { adminService } from '@shared/services/adminService'
import logger from '@shared/utils/logger'

const AdminPanel = () => {
  const isMobile = useResponsive()
  useAppHeight()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [accessGranted, setAccessGranted] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await adminService.getStatsOverview()
        if (response.data.status === 200) {
          setAccessGranted(true)
        } else {
          navigate('/main', { replace: true })
        }
      } catch (err) {
        if (err.response?.status === 403) {
          navigate('/main', { replace: true })
        } else {
          logger.error('Ошибка при проверке доступа к админ-панели:', err)
          navigate('/main', { replace: true })
        }
      } finally {
        setCheckingAccess(false)
      }
    }

    checkAdminAccess()
  }, [navigate])

  useEffect(() => {
    const applyHashTab = () => {
      const hash = (window.location.hash || '').replace('#', '').replace(/^\//, '')
      const valid = ['dashboard', 'users', 'teams', 'challenges', 'posts', 'comments', 'statistics']
      if (valid.includes(hash)) {
        setActiveTab(hash)
      }
    }
    applyHashTab()
    window.addEventListener('hashchange', applyHashTab)
    return () => window.removeEventListener('hashchange', applyHashTab)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />
      case 'users':
        return <UserManagement />
      case 'challenges':
        return <ChallengeManagement />
      case 'teams':
        return <TeamsManagement />
      case 'posts':
        return <PostModeration />
      case 'comments':
        return <CommentModeration />
      case 'statistics':
        return <StatisticsPanel />
      default:
        return <AdminDashboard />
    }
  }

  if (checkingAccess) {
    return (
      <div className="admin-panel">
        <div className="admin-loading">
          <div className="admin-loading__spinner"></div>
          <div className="admin-loading__text">Проверка доступа...</div>
        </div>
      </div>
    )
  }

  if (!accessGranted) {
    return null
  }

  return (
    <div className="admin-panel">
      {isMobile ? <MobileHeader /> : <Header isFeedPage={false} />}

      <div className="admin-panel__container">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} isMobile={isMobile} />

        <div className="admin-panel__content">{renderContent()}</div>
      </div>

      {isMobile && <MobileFooter />}
    </div>
  )
}

export default AdminPanel
